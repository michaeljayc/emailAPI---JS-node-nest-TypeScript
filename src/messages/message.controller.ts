import { 
    Body, 
    Controller, 
    Delete, 
    ForbiddenException, 
    Get, 
    NotFoundException, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req, 
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IResponseFormat } from "../common/common.interface";
import Message from "./message.entity";
import { Request } from "express";
import MessageService from "./message.service";
import { formatResponse, formatLogs } from "src/common/common.functions";
import LoggerService from "src/Services/logger.service";
import { UserService } from "src/users/user.service";
import { 
    isValidMenu, 
    Menu,
    isValidMenuTables
} from "./message.common";

@Controller("messages")
export class MessageController {

    constructor(private readonly messageService: MessageService,
        private readonly jwtService:JwtService,
        private readonly loggerService: LoggerService,
        private readonly userService: UserService){}

    @Get("")
    async getMessages(@Req() request: Request,
        @Query() query): Promise<IResponseFormat | any> {

            let filtered: {};
            let table = query.menu ? query.menu : "inbox";
            let formatted_response: IResponseFormat;
            const cookie = request.cookies["jwt"];

            // If not logged-in, forbid access
            if (!cookie) {
                throw new ForbiddenException()
            }

            if (isValidMenu(table)) {
                // Get cookie data
                const user_data = await 
                    this
                    .jwtService
                    .verifyAsync(cookie);

                if (isValidMenuTables(table)) {
                    // Get the id to filter
                    if (table === "inbox")
                        filtered = {"recipient_id": user_data.id}
                    else 
                        filtered = {"sender_id": user_data.id}
                } else {
                    filtered = {"menu_state": query.menu === "starred" ?
                        Menu.starred : Menu.important,
                        "recipient_id": user_data.id
                    }
                    table = "inbox";
                }

                formatted_response = await this
                    .messageService
                    .getMessages({
                        filtered,
                        table,
                        id: user_data.id
                    })
                        .then( result => {
                            return formatResponse(
                                    [result], true, "Success"
                                );
                        })
                        .catch( error => {
                            return formatResponse(
                                    [error], false, "Failed"
                                );
                        })
            } else {
                throw new NotFoundException()
            }

            this
            .loggerService
            .insertLogs(formatLogs(
                    "getMessages", query, formatted_response)
                )
            
            return formatted_response;
    }

    // http://localhost:3000/api/messages/inbox/details/:message_id
    // OR 
    // http://localhost:3000/api/messages/inbox/reply/:message_id
    @Get(":menu/:action/:message_id")
    async getMessageDetails(@Req() request: Request,
        @Param() param): Promise<IResponseFormat> {

            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException();
            
            let response = await this
                .messageService
                .getMessageDetails(param.menu, param.message_id)
            if (!response) 
                throw new NotFoundException()
            
            else {
                if (param.menu === "inbox") {        
                    response = await this.updateReadUnread(response.id)
                        .then( result => {
                            return formatResponse(
                                [{
                                    recipient: result.recipient,
                                    recipient_id: result.recipient_id,
                                    sender: result.sender,
                                    sender_id: result.sender_id,
                                    subject: result.subject,
                                    message: result.message,
                                    message_origin_id: 
                                        result.message_origin_id
                                }],
                                true,
                                "Success"
                            )
                        })
                        .catch( error => {
                            return formatResponse(
                                    [error], false, "Failed"
                                )
                        })
                    
                    
                }     
            } 
            
            this
            .loggerService
            .insertLogs(formatLogs("getMessageDetails",
                        param,
                        response
                    )
                )

            return response;
    }
    
    @Post("send")
    async sendMessage(@Req() request: Request,
        @Body() message: Message): Promise<IResponseFormat> {
            
            let formatted_response: any;
            const drafted_message = message?.drafted;
            const cookie = request.cookies["jwt"];

            if (!cookie)
                throw new ForbiddenException();

            // Retrieve sender data
            let sender_data = await this.jwtService.verifyAsync(cookie);

            // Retrieve recipient data
            let recipient_data = await 
                this
                .userService
                .getUserByEmail(message.recipient);
            
            if (Object.keys(recipient_data._responses).length < 1) {
                formatted_response = formatResponse(
                    [message],
                    false,
                    "Receipient does not exist."
                );
            } else {
                recipient_data = recipient_data.next()._settledValue;

                // add data to construct message
                message.created_date = String(Date.now());
                message.updated_date = String(Date.now()); 
                message.recipient_id = recipient_data.id;
                message.menu_state = 0;
                message.sender = sender_data.email
                message.sender_id = sender_data.id;
                message.message_origin_id = "";
                message.read = false;
                message.drafted = false;
            
                // Insert data to recipient's INBOX
                formatted_response =  await this
                    .messageService
                    .sendMessage("inbox",message)
                        .then( result => {
                            return formatResponse(
                                [result], true, "Message Sent"
                            );

                        })
                        .catch( error => {
                            return formatResponse(
                                [error], false, "Failed"
                            );
                        })

                // Insert data to sender's SENT
                if (formatted_response.success) {
                    let response = await this
                        .messageService
                        .sendMessage("sent",message)
                            .then( result => {
                                return formatResponse(
                                    [result],true,"Message Sent"
                                )
                            })
                            .catch ( error => {
                                return formatResponse(
                                    [error], false, "Failed"
                                );
                            })
                }

                // Check if message already exists or new
                // If exists, delete in drafts after sending
                if (drafted_message) {
                    let response =  await 
                        this
                        .messageService
                        .deleteMessage("drafts",message.id)
                            .then( result => {
                                return formatResponse(
                                    [result],true,"Success"
                                )
                            })
                            .catch( error => {
                                return formatResponse(
                                    [error],false,"Failed"
                                )
                            })

                }
            }

            this
            .loggerService
            .insertLogs(formatLogs(
                        "sendMessage", message, formatted_response
                    )
                )
            
        return formatted_response;
    }

    @Post("save-as-draft")
    async saveAsDraft(@Req() request: Request,
        @Body() message: Message): Promise<IResponseFormat> {
            
            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException();

            // Retrieve sender data
            let sender_data = await this.jwtService.verifyAsync(cookie);

            // construct message data
            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());
            message.sender = sender_data.email;
            message.sender_id = sender_data.id;
            message.drafted = true;
            
            let response =  await this
                .messageService
                .sendMessage("drafts",message)
                    .then( result => {
                        return formatResponse(
                            [message], true, "Saved as draft"
                        );
                    })
                    .catch( error => {
                        return formatResponse(
                            [message], false, "Failed"
                        );
                    })
            
            
            this
            .loggerService
            .insertLogs(formatLogs(
                        "saveAsDraft", message, response
                    )
                )

            return response;
    }

    @Put("drafts/update")
    async updateDraftedMessage(@Req() request: Request,
        @Body() message:Message,    
        @Query() query): Promise<IResponseFormat> {
            
            const message_id = query.id;
            let formatted_response: IResponseFormat;
            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException();

            message.updated_date = String(Date.now())    
            
            let response = await this
                .messageService
                .updateMessage("drafts",message_id,message);

            if (response.replaced === 1)
                formatted_response = formatResponse(
                    [response], true, "Message updated."
                )
            else 
                formatted_response = formatResponse(
                    [response], false, "Failed to update message."
                )
            
            this
            .loggerService
            .insertLogs(formatLogs(
                    "updateMessage",response,formatted_response
                    )
                )
                        
            return formatted_response;
    }

    @Delete(":menu/delete")
    async deleteMessage(@Req() request:Request,
        @Param() param,
        @Query() query): Promise<IResponseFormat> {
            
            const table = param.menu;
            const message_id = query.id;

            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException();

            let response = await this
                .messageService
                .deleteMessage(table, message_id)
                    .then( result => {
                        if (result.deleted === 1){
                            return formatResponse(
                                [result], true, "Message deleted."
                            )   
                        } else {
                            return formatResponse(
                                [result], false, "Message does not exist."
                            ) 
                        }
                    })
                    .catch( error => {
                        return formatResponse(
                            [error], true, "Failed."
                        )
                    })
            
            this
            .loggerService
            .insertLogs(formatLogs(
                        "deleteMessage", {param,query}, response
                    )
                )

            return response;
    }

    // http://localhost:3000/api/messages/inbox/reply?message_id=
    @Post("inbox/reply")
    async replyToMessage(@Req() request: Request,
        @Query() query,
        @Body() message: Message): Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;
            const cookie = request.cookies["jwt"];
            if (!cookie) 
                throw new ForbiddenException();
            
            const reply_recipient = message.sender;
            const reply_recipient_id = message.sender_id;

            // Set message details
            if (!message.message_origin_id) {
                message.message_origin_id = query.message_id;
                message.subject = `RE: ${message.subject}`;
            }

            message.sender = message.recipient;
            message.sender_id = message.recipient_id;
            message.recipient = reply_recipient;
            message.recipient_id = reply_recipient_id;
            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());
            message.read = false;
            message.drafted = false;
            message.menu_state = 0;

            // Send message to recipient's INBOX
            formatted_response = await this
                .messageService
                .sendMessage("inbox", message)
                    .then( result => {
                        return formatResponse(
                            [result], true, "Message sent."
                        )
                    })
                    .catch ( error => {
                        return formatResponse(
                            [error], false, "Failed."
                        )
                    })
            
            // Insert data to sender's SENT
            if (formatted_response.success) {
                let response = await this
                    .messageService
                    .sendMessage("sent",message)
                        .then( result => {
                            return formatResponse(
                                [result],true,"Message Sent"
                            )
                        })
                        .catch ( error => {
                            return formatResponse(
                                [error], false, "Failed"
                            );
                        })
            }
            
            this
            .loggerService
            .insertLogs(formatLogs(
                "replyToMessage",message, formatted_response
                )
            );

            return formatted_response;
    }

    @Put(":menu/:message_id/:state")
    async setMenuState(@Req() request: Request,
        @Param() param): Promise<IResponseFormat | any> {
            
            let formatted_response: IResponseFormat = null;
            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException;
            
            if (isValidMenuTables(param.menu)) {

                let message = await 
                    this
                    .messageService
                    .getMessageDetails(param.menu, param.message_id)
                
                if (message) {
                    // check if message is already starred or important
                    if (message.menu_state === Menu.starred || 
                        message.menu_state === Menu.important ) {
                            message.menu_state = 0;
                    }  else {
                        message.menu_state = param.state === "starred" ?
                        Menu.starred :
                        Menu.important;
                    }

                    let response = await
                        this
                        .messageService
                        .updateMessage(param.menu, 
                            param.message_id, 
                            message)
                                .then( result => {
                                    return formatResponse(
                                        [message], 
                                        true, 
                                        `Message menu_state updated`
                                    )
                                })
                                .catch( error => {
                                    return formatResponse(
                                        [error], false, `Failed`
                                    )
                                })

                    formatted_response = response;
                } else {
                    formatted_response = formatResponse(
                        [param],
                        false,
                        "Message not found."
                    )
                }
            } else {
                return { 
                    statusCode: "404",
                    message: `'${param.menu}' not found.`
                }
            }

        return formatted_response
    }

    async updateReadUnread(message_id: string): Promise<Message> {
        return await this.messageService.updateReadUnread(message_id)
    }

    
}

export default MessageController;
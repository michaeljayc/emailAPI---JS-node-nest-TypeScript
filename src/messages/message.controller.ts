import { 
    Body, 
    Controller, 
    Delete, 
    ForbiddenException, 
    Get, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req }
    from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ResponseFormat } from "src/common/common";
import Message from "./message.entity";
import { Request } from "express";
import MessageService from "./message.service";
import * as common from "src/common/common";
import LoggerService from "src/Services/logger.service";
import { UserService } from "src/users/user.service";
import { RethinkModule } from "rethinkdb/rethink.module";

@Controller("messages")
export class MessageController {

    constructor(private readonly messageService: MessageService,
        private readonly jwtService:JwtService,
        private readonly loggerService: LoggerService,
        private readonly userService: UserService){}

    @Get(":menu")
    async getMessages(@Req() request: Request,
        @Param() param): Promise<ResponseFormat> {

            let table = param.menu ? param.menu : "inbox";
            let response: any;
            let formatted_response: ResponseFormat;
            const cookie = request.cookies["jwt"];

            // If not logged-in, forbid access
            if (!cookie)
                throw new ForbiddenException;
            
            const user_data = await this.jwtService.verifyAsync(cookie);
            
            if (table === "inbox") {
                response = await this
                    .messageService
                    .getReceivedMessages(user_data.id)
                        .then( result => {
                            formatted_response = common
                                .formatResponse([result], true, "Success");
                        })
                        .catch( error => {
                            formatted_response = common
                                .formatResponse([error], false, "Failed");
                        })
            } else {
                response = await this
                    .messageService
                    .getComposedMessages(user_data.id, table)
                        .then( result => {
                            formatted_response = common
                                .formatResponse([result], true, "Success");
                        })
                        .catch( error => {
                            formatted_response = common
                                .formatResponse([error], false, "Failed");
                        })
            }

            this
            .loggerService
            .insertLogs(common
                .formatLogs(
                    "getMessages", param, formatted_response)
                )
            
            return formatted_response;
    }

    @Get(":menu/:message_id")
    async getMessageDetails(@Req() request: Request,
        @Param() param): Promise<ResponseFormat> {

            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException;
            
            let response = await this
                .messageService
                .getMessageDetails(param.menu, param.message_id)
            if (!response) 
                response = common
                    .formatResponse([], false, "Message does not exist.");
            
            else {
                if (param.menu === "inbox") {        
                    response = await this.updateReadUnread(response)
                        .then( result => {
                            return common
                                .formatResponse(
                                    [result], true, "Success"
                                )
                        })
                        .catch( error => {
                            return common
                                .formatResponse(
                                    [], false, "Failed"
                                )
                        })
                }     
            } 
            
            this.loggerService
                .insertLogs(common
                    .formatLogs("getMessageDetails",
                        param,
                        response))

            return response;
    }
    
    @Post("send")
    async sendMessage(@Req() request: Request,
        @Body() message: Message): Promise<ResponseFormat> {
            
            let formatted_response: any;
            let is_exist = message.id ? true : false;
            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException;

            // Retrieve recipient data
            let recipient_data = await 
                this
                .userService
                .getUserByEmail(message.recipient);
            
            if (Object.keys(recipient_data._responses).length < 1) {
                formatted_response = common.formatResponse(
                    [message],
                    false,
                    "Receipient does not exist.");
            } else {
                recipient_data = recipient_data.next()._settledValue;

                if (!is_exist) 
                    message.created_date = String(Date.now());
              
                message.updated_date = String(Date.now()); 
                message.recipient_id = recipient_data.id;

                // Insert data to recipient's INBOX
                formatted_response =  await this
                    .messageService
                    .sendMessage("inbox",message)
                        .then( result => {
                            return common
                                .formatResponse([result], true, "Message Sent");

                        })
                        .catch( error => {
                            return  common
                                .formatResponse([error], false, "Failed");
                        })

                // Insert data to sender's SENT
                if (formatted_response.success) {
                    let response = await this
                        .messageService
                        .sendMessage("sent",message)
                            .then( result => {
                                return common
                                    .formatResponse(
                                        [result],true,"Message Sent"
                                    )
                            })
                            .catch ( error => {
                                return common
                                .formatResponse([error], false, "Failed");
                            })
                }

                // Check if message already exists or new
                // If exists, delete in drafts after sending
                if (is_exist) {
                    let response =  await 
                        this
                        .messageService
                        .deleteMessage("drafts",message.id)
                            .then( result => {
                                return common
                                    .formatResponse(
                                        [result],true,"Success"
                                    )
                            })
                            .catch( error => {
                                return common
                                    .formatResponse(
                                        [error],false,"Failed"
                                    )
                            })

                }
            }

            this
            .loggerService
            .insertLogs(common
                .formatLogs(
                    "sendMessage", message, formatted_response
                )
            )
            
            return formatted_response;
    }

    @Post("save-as-draft")
    async saveAsDraft(@Req() request: Request,
        @Body() message: Message): Promise<ResponseFormat> {
            
            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException;

            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());
            
            let response =  await this
                .messageService
                .sendMessage("drafts",message)
                    .then( result => {
                        return common
                            .formatResponse(
                                [message], true, "Saved as draft"
                            );
                    })
                    .catch( error => {
                        return common
                            .formatResponse(
                                [message], false, "Failed"
                            );
                    })
            
            
            this.loggerService.insertLogs
                (common.formatLogs("saveAsDraft", message, response))
            return response;
    }

    @Put("drafts/update")
    async updateDraftedMessage(@Req() request: Request,
        @Body() message:Message,    
        @Query() query): Promise<ResponseFormat> {
            
            const message_id = query.id;
            let formatted_response: ResponseFormat;
            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException;

            message.updated_date = String(Date.now())    
            
            let response = await this
                .messageService
                .updateMessage(message_id,message);

            if (response.replaced === 1)
                formatted_response = common
                    .formatResponse([response], true, "Message updated.")
            else 
                formatted_response = common
                    .formatResponse(
                        [response], false, "Failed to update message."
                    )
            
            this.loggerService
                .insertLogs(common
                    .formatLogs(
                        "updateMessage",response,formatted_response
                        ))
                        
            return formatted_response;
    }

    @Delete(":menu/delete")
    async deleteMessage(@Req() request:Request,
        @Param() param,
        @Query() query): Promise<ResponseFormat> {
            
            const table = param.menu;
            const message_id = query.id;

            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException;

            let response = await this
                .messageService
                .deleteMessage(table, message_id)
                    .then( result => {
                        if (result.deleted === 1){
                            return common
                            .formatResponse(
                                [result], true, "Message deleted."
                            )   
                        } else {
                            return common
                            .formatResponse(
                                [result], false, "Message does not exist."
                            ) 
                        }
                    })
                    .catch( error => {
                        return common
                            .formatResponse([error], true, "Failed.")
                    })
            
            this.loggerService
                .insertLogs(common
                    .formatLogs(
                        "deleteMessage", {param,query}, response
                    ))

            return response;
    }

    @Post("inbox/reply/:message_id")
    async replyToMessage(@Req() request: Request,
        @Param() param,
        @Body() message: Message): Promise<ResponseFormat> {

            const cookie = request.cookies["jwt"];
            if (!cookie) 
                throw new ForbiddenException;
            
            const reply_recipient = message.sender;
            const reply_recipient_id = message.sender_id;

            // Set message details
            message.message_origin_id = message.message_origin_id ?
                message.message_origin_id :
                param.message_id;
            message.subject = `RE: ${message.subject}`;
            message.sender = message.recipient;
            message.sender_id = message.recipient_id;
            message.recipient = reply_recipient;
            message.recipient_id = reply_recipient_id;
            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());

            //Send reply to sender's INBOX
            let response = await this
                .messageService
                .sendMessage("inbox", message)
                    .then( result => {
                        return common
                            .formatResponse(
                                [result], true, "Message sent."
                            )
                    })
                    .catch ( error => {
                        return common
                            .formatResponse(
                                [error], false, "Failed."
                            )
                    })
            
            this
            .loggerService
            .insertLogs(
                common.formatLogs("replyToMessage",message, response)
            );

            return response;
    }

    // Assuming it is in INBOX messages
    // @Post(":message_id")
    // async setMenuState(@Req() request: Request,
    //     @Param() param): Promise<ResponseFormat> {
    //         console.log(param)
    //         return;
    // }

    async updateReadUnread(message: Message): Promise<Message> {
        return await this.messageService.updateReadUnread(message)
    }

    
}

export default MessageController;
import { 
    BadRequestException,
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    NotFoundException, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req,
    UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IResponseFormat } from "../common/common.interface";
import Message from "./message.entity";
import { Request, response } from "express";
import MessageService from "./message.service";
import { formatResponse, formatLogs } from "src/common/common.functions";
import LoggerService from "src/services/logger.service";
import { UserService } from "src/users/user.service";
import { 
    isValidMenu, 
    Menu,
    isValidMenuTables,
    STATE
} from "./message.common";
import { AuthTokenGuard } from "src/guards/auth-token/auth-token.guard";

@Controller("messages")
export class MessageController {

    constructor(private readonly messageService: MessageService,
        private readonly jwtService:JwtService,
        private readonly loggerService: LoggerService,
        private readonly userService: UserService){}
    
    @UseGuards(AuthTokenGuard)
    @Get("")
    async getMessages(@Req() request: Request,
        @Query() query): Promise<IResponseFormat | any> {

            let filtered: {};
            let menu = query.menu ? query.menu : "inbox";
            let formatted_response: IResponseFormat;

            try {
                const cookie = request.cookies["jwt"];

                if (isValidMenu(menu)) {
                    // Get cookie data
                    const user_data = await 
                        this
                        .jwtService
                        .verifyAsync(cookie);
    
                    if (isValidMenuTables(menu)) {
                        // assign id to filter
                        if (menu === "inbox")
                            filtered = {"recipient_id": user_data.id}
                        else 
                            filtered = {"sender_id": user_data.id}
                    } else {
                        filtered = {
                            "menu_state": query.menu === "starred" ?
                            Menu.starred : Menu.important,
                            "recipient_id": user_data.id
                        }
                        menu = "inbox";
                    }
                    
                    let response = await this
                        .messageService
                        .getMessages({
                            filtered,
                            menu,
                            id: user_data.id
                        })
                    
                    formatted_response = formatResponse(
                        response,true,"Success"
                    );
                                 
                } else
                    throw new BadRequestException
                        (`Invalid Menu '${menu}'`) 

            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                    ("getMessages", query, formatted_response)
                )
            
            return formatted_response;
    }

    // http://localhost:3000/api/messages/inbox/details/:message_id
    // OR 
    // http://localhost:3000/api/messages/inbox/reply/:message_id
    @UseGuards(AuthTokenGuard)
    @Get(":menu/:action/:message_id")
    async getMessageDetails(@Req() request: Request,
        @Param() param)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;

            try {
                // Check if message id exists
                let response = await this
                    .messageService
                    .getMessageDetails(param.menu, param.message_id)

                if (!response)
                    throw new HttpException
                        ("Invalid menu or table", 404)

                if (param.menu === "inbox")
                    response = await this.updateReadUnread(response.id)

                formatted_response = formatResponse
                    (response, true, "Success.");
            
            } catch (error) {
                formatted_response = formatResponse(
                    [error],
                    false,
                    error.status
                )
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("getMessageDetails", param, formatted_response)
            )

            return formatted_response;
    }
    
    // http://localhost:3000/api/messages/send
    @UseGuards(AuthTokenGuard)
    @Post("send")
    async sendMessage(@Req() request: Request,
        @Body() message: Message)
        : Promise<IResponseFormat> {
            
            let formatted_response: any;
            const drafted_message = message?.drafted;

            try {
                // Retrieve sender data
                const sender_data = await this.jwtService.verifyAsync
                    (request.cookies["jwt"])
                
                // Retrieve recipient data
                let recipient_data = await 
                this
                .userService
                .getUserByEmail(message.recipient);
                
                if (Object.keys(recipient_data._responses).length < 1)
                    throw new NotFoundException
                        (`${message.recipient}`, "Recipient doesn't exist")   
                
                // get recipient data
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
                                [message], true, "Message Sent"
                            )});

                // Insert data to sender's SENT
                if (formatted_response.success)
                    await this.messageService.sendMessage("sent",message)

                // Check if message already exists in DRAFTS
                // If exists, delete in drafts after sending
                if (drafted_message)
                    await this.messageService.deleteMessage
                        ("drafts",message.id)
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("sendMessage", message, formatted_response)
            )
            
            return formatted_response;
    }

    @UseGuards(AuthTokenGuard)
    @Post("save-as-draft")
    async saveAsDraft(@Req() request: Request,
        @Body() message: Message): Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;

            try {
                // Retrieve sender data
                let sender_data = await 
                    this
                    .jwtService
                    .verifyAsync(request.cookies["jwt"]);

                // construct message data
                message.created_date = String(Date.now());
                message.updated_date = String(Date.now());
                message.sender = sender_data.email;
                message.sender_id = sender_data.id;
                message.drafted = true;
                message.read = false;
                
                let response =  await 
                    this
                    .messageService
                    .sendMessage("drafts",message);

                formatted_response = formatResponse(
                    message,
                    true,
                    "Saved as draft."
                )
            } catch (error) {
                formatted_response = formatResponse(
                    [error],
                    false,
                    error.status
                )
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("saveAsDraft", message, formatted_response)
            )

            return formatted_response;
    }

    // http://localhost:3000/api/messages/drafts/update?id=123abc
    @UseGuards(AuthTokenGuard)
    @Put("drafts/update")
    async updateDraftedMessage(@Req() request: Request,
        @Body() message:Message,    
        @Query() query)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;

            try {
                const message_id = query.id;
                message.updated_date = String(Date.now()) 

                let response = await this
                    .messageService
                    .updateMessage("drafts",message_id,message);

                if (response.replaced === 1)
                    formatted_response = formatResponse
                    ([message], true, "Message updated.")
                else 
                    formatted_response = formatResponse
                    ([query], false, "Message ID doesn't exist.")
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.statusMessage)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("updateMessage", message, formatted_response)
            )
                        
            return formatted_response;
    }

    @UseGuards(AuthTokenGuard)
    @Delete(":menu/delete")
    async deleteMessage(@Req() request:Request,
        @Param() param,
        @Query() query)
        : Promise<IResponseFormat> {
            
            const table = param.menu;
            const message_id = query.id;
            let formatted_response: IResponseFormat;

            try {               
                let response = await this
                    .messageService
                    .deleteMessage(table, message_id)
                        
                    if (response.deleted === 1)
                        return formatResponse
                        ([query], true, "Message deleted.")   
                    else
                        return formatResponse
                        (   [query], 
                            false, 
                            `Message ID does not exist in ${table}`
                        ) 
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status);
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("deleteMessage", param, formatted_response)
            )

            return formatted_response;
    }

    // http://localhost:3000/api/messages/inbox/reply?message_id=
    @UseGuards(AuthTokenGuard)
    @Post("inbox/reply")
    async replyToMessage(@Query() query,
        @Body() message: Message)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;

            try {
                // check if query.id is a valid id
                if (!await this.messageService.getMessageById(query.id))
                    throw new HttpException
                        (`Message ID ${query.id} doesn't exist`, 404)
            
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
                let response = await this
                    .messageService
                    .sendMessage("inbox", message)
                    console.log(response)
                if (response.inserted === 1)
                    formatted_response = formatResponse
                        ([message], true, "Reply sent.")
                else
                    formatted_response = formatResponse
                        ([query], false, `Error in sending reply.`);
            
                // Insert data to sender's SENT
                if (formatted_response.success) 
                    await this.messageService.sendMessage("sent",message)
                
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status);
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("replyToMessage",message, formatted_response)
            );

            return formatted_response;
    }

    // http://localhost:3000/api/messages/inbox?id=123abc&state=starred
    @UseGuards(AuthTokenGuard)
    @Put(":menu")
    async setMenuState(@Req() request: Request,
        @Param() param,
        @Query() query)
        : Promise<IResponseFormat | any> {
            
            let formatted_response: IResponseFormat;

            try {
                if (isValidMenuTables(param.menu)) {

                    let message = await 
                        this
                        .messageService
                        .getMessageDetails(param.menu, query.id)

                    if (message) {

                        //check if state is valid
                        if (!Object.keys(STATE).includes(query.state))
                            throw new BadRequestException
                                (`Invalid menu '${query.state}'`)

                        // check if message is already starred or important
                        if (message.menu_state === Menu.starred || 
                            message.menu_state === Menu.important ) {
                                message.menu_state = 0;
                        }  else {
                            message.menu_state = param.state === "starred" ?
                            Menu.starred :
                            Menu.important;
                        }

                        await this.messageService.updateMessage
                            (param.menu, query.id, message)

                        formatted_response = formatResponse
                            ([message], true, `Message set to ${query.state}`)
                    } else
                        throw new BadRequestException
                            (`${query.id} doesn't exist`)
                } else
                    throw new BadRequestException
                        (`Invalid menu ${param.menu}`)

            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status)
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("setMenuState", {param, query}, formatted_response)
            )

            return formatted_response
    }

    async updateReadUnread(message_id: string): Promise<Message> {
        return await this.messageService.updateReadUnread(message_id)
    }   
}

export default MessageController;
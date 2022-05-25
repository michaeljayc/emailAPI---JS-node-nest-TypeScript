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
import { NewMessageDTO } from "./message.dto";

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
                            filtered = {"recipient": user_data.email}
                        else 
                            filtered = {"sender": user_data.email}
                    } else {
                        filtered = {
                            "menu_state": query.menu === "starred" ?
                            Menu.starred : Menu.important,
                            "recipient": user_data.email
                        }
                        menu = "inbox";
                    }
                    
                    let response = await this
                        .messageService
                        .getMessages({
                            filtered,
                            menu
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
            const newMessageDTO = new NewMessageDTO();
            const default_message = ({
                ...newMessageDTO,
                ...message
            })

            try {
                // Check if recipient exist
                let recipient_data = await 
                this
                .userService
                .getUserByEmail(message.recipient);
                
                if (Object.keys(recipient_data._responses).length < 1)
                    throw new NotFoundException
                        (`${message.recipient}`, "Recipient doesn't exist")   
            
                // Insert data to recipient's INBOX
                formatted_response =  await this
                    .messageService
                    .sendMessage("inbox",default_message)
                        .then( result => {
                            return formatResponse(
                                [default_message], true, "Message Sent"
                            )});

                // Insert data to sender's SENT
                if (formatted_response.success)
                    await this.messageService.sendMessage("sent",default_message)

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
                ("sendMessage", default_message, formatted_response)
            )
            
            return formatted_response;
    }

    @UseGuards(AuthTokenGuard)
    @Post("save-as-draft")
    async saveAsDraft(@Req() request: Request,
        @Body() message: Message): Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            const newMessageDTO = new NewMessageDTO();
            const default_message = ({
                ...newMessageDTO,
                ...message
            })
            try {
                // set drafted to TRUE
                default_message.drafted = true;

                await 
                    this
                    .messageService
                    .sendMessage("drafts",default_message);

                formatted_response = formatResponse(
                    default_message,
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
                ("saveAsDraft", default_message, formatted_response)
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
            const newMessageDTO = new NewMessageDTO();
            const default_message = ({
                ...newMessageDTO,
                ...message
            })

            try {
                // check if query.id is a valid id
                if (!await this.messageService.getMessageById(query.message_id))
                    throw new HttpException
                        (`Message ID ${query.message_id} doesn't exist`, 404)

                // Set message details
                if (!default_message.message_origin_id) {
                    default_message.message_origin_id = query.message_id;
                    default_message.subject = `RE: ${default_message.subject}`;
                }

                // Send message to recipient's INBOX
                let response = await this
                    .messageService
                    .sendMessage("inbox", default_message)
 
                if (response.inserted === 1)
                    formatted_response = formatResponse
                        ([default_message], true, "Reply sent.")
                else
                    formatted_response = formatResponse
                        ([query], false, `Error in sending reply.`);
            
                // Insert data to sender's SENT
                if (formatted_response.success) 
                    await this.messageService.sendMessage("sent",default_message)
                
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status);
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("replyToMessage",default_message, formatted_response)
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
                            message.menu_state = (query.state === "starred") ?
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
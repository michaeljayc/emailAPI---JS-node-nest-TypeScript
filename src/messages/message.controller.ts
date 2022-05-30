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
    UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IResponseFormat } from "../common/common.interface";
import Message from "./message.entity";
import { Request } from "express";
import MessageService from "./message.service";
import { formatResponse, formatLogs, setDateTime } from "src/common/common.functions";
import LoggerService from "src/services/logger.service";
import { UserService } from "src/users/user.service";
import { 
    isValidMenu,
    STATE,
    MENU,
    menu
} from "./message.common";
import { AuthTokenGuard } from "src/guards/auth-token/auth-token.guard";
import { NewMessageDTO } from "./message.dto";
import { SearchService } from "src/common/search/search.service";
import { PaginationService } from "src/common/pagination/pagination.service";
import { ValidateNested } from "class-validator";
import { MessageValidationPipe } from "src/pipes/message-validator.pipe";
@Controller("messages")
export class MessageController {

    constructor(private readonly messageService: MessageService,
        private readonly jwtService:JwtService,
        private readonly loggerService: LoggerService,
        private readonly userService: UserService,
        private readonly searchService: SearchService,
        private readonly paginationService: PaginationService){}
    
    // http://localhost:3000/api/messages
    // OR 
    // http://localhost:3000/api/messages?menu=
    @UseGuards(AuthTokenGuard)
    @Get("")
    async getMessages(@Req() request: Request,
        @Query() query): Promise<IResponseFormat | any> {

            let filtered: any;
            let response: any;
            let menu = query.menu ? query.menu : "inbox";
            let formatted_response: IResponseFormat;
            let page_number = (query.page !== undefined) ? 
                Number(query.page) : 1;

            try {
                if (isValidMenu(menu)) {
                    // Get cookie data
                    const user_data = await 
                        this
                        .jwtService
                        .verifyAsync(request.cookies["jwt"]);
                    
                    let email: string = user_data.email;
                    
                    if (menu === "sent" || menu === "drafts") {
                        filtered = {"sender": {"email": email,
                            "menu": MENU.sent
                        }}
                        
                        if (menu === "drafts")
                            filtered.sender.menu = MENU.drafts
                    }
                    else {
                        filtered = {"recipient": {"email": email} }
                        if (menu !== "inbox")
                            filtered.recipient.menu = (menu === "starred") ?
                                MENU.starred : 
                                MENU.important;
                    }
                    // Retrieve and paginate data
                    response = await this
                        .messageService
                        .getMessages(filtered)
                        .then(result => {
                            return this
                            .paginationService
                            .pagination(result, page_number);
                        })

                    formatted_response = formatResponse
                        (response,true,"Success");
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
    @UseGuards(AuthTokenGuard)
    @Get(":menu/details/:message_id")
    async getMessageDetails(@Param() param)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;

            try {
                // Check if message id exists
                let response = await this
                    .messageService
                    .getMessageDetails(param.message_id)

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
                    .getUserByEmail(message.recipient.email);
                
                if (Object.keys(recipient_data._responses).length < 1)
                    throw new NotFoundException
                        (`${message.recipient.email}`, "Recipient doesn't exist")   
                
                // set sender attributes
                default_message.sender.menu = MENU.sent;

                // set recipient attributes
                default_message.recipient.menu = MENU.inbox;

                // insert to messages
                formatted_response =  await this
                .messageService
                .sendMessage(default_message)
                    .then( result => {
                        return formatResponse(
                            default_message, true, "Message Sent"
                    )});
                
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

    // http://localhost:3000/api/messages/save-as-draft
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
                // set status to draft
                default_message.status = STATE.draft;
                default_message.sender.menu = MENU.drafts;
                
                await this
                    .messageService
                    .sendMessage(default_message);

                formatted_response = formatResponse(
                    default_message,
                    true,
                    "Saved as draft."
                )
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status)
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
                message.updated_date = setDateTime();

                let response = await this
                    .messageService
                    .updateMessage(message_id,message);

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

    // http://localhost:3000/api/messages/drafts/send?id=123abc
    @UseGuards(AuthTokenGuard)
    @Put("drafts/send")
    async sendDraftMessage(@Body(MessageValidationPipe) message: Message,
        @Query() query)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            const newMessageDTO = new NewMessageDTO();
            const default_message = ({
                ...newMessageDTO,
                ...message
            });

            try {
                // check if id exists
                const response = await this
                    .messageService
                    .getMessageById(query.id)
                
                if (!response)
                    throw new NotFoundException
                        (`ID: ${query.id} doesn't exist`)
                
                const def_message = ({
                    ...default_message,
                    recipient: {
                        ...default_message.recipient,
                        menu: MENU.inbox
                    },
                    sender: {
                        ...default_message.sender,
                        menu: MENU.sent
                    },
                    status: 0,
                    updated_date: setDateTime()
                })

                formatted_response = await this
                    .messageService
                    .updateMessage(query.id, def_message)
                    .then( result => {
                        return formatResponse
                            (def_message, true, "Message Sent.")
                    })
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.statusMessage)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("sendDraftMessage", query, formatted_response)
            )

            return formatted_response; 
    }

    // http://localhost:3000/api/messages/menu/delete?id=9f415197-22f9-4f93-88b2-77e381ff4079
    @UseGuards(AuthTokenGuard)
    @Delete(":menu/delete")
    async deleteMessage(@Req() request:Request,
        @Param() param, @Query() query)
        : Promise<IResponseFormat> {
            
            const message_id = query.id;
            let formatted_response: IResponseFormat;

            try {           
                // check if menu is valid
                if (!menu.includes(param.menu))
                    throw new BadRequestException
                        (`Menu ${param.menu} doesn't exist.`)

                formatted_response = await this
                    .messageService
                    .deleteMessage(message_id)
                    .then(result => {
                        return formatResponse
                            ({query}, true, "Message Deleted")
                    });
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status);
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("deleteMessage", {param,query}, formatted_response)
            )

            return formatted_response;
    }

    // http://localhost:3000/api/messages/inbox/reply?id=
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
                if (!await this.messageService.getMessageById(query.id))
                    throw new HttpException
                        (`Message ID ${query.id} doesn't exist`, 404)

                // Set message details
                const def_message = ({
                    ...default_message,
                    message_origin_id: (!default_message.message_origin_id) ?
                        query.id : 
                        default_message.message_origin_id,
                    subject: (!default_message.message_origin_id) ? 
                        `RE: ${default_message.subject}` :
                        default_message.subject,
                    recipient: {
                        ...default_message.recipient,
                        menu: MENU.inbox,
                    },
                    sender: {
                        ...default_message.sender,
                        menu: MENU.sent,
                    }
                })
                
                // Send message to recipient's INBOX
                formatted_response = await this
                    .messageService
                    .sendMessage(def_message)
                    .then( result => {
                        return formatResponse
                            (def_message, true, "Reply sent.")
                    })
 
                
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
    @Put("inbox")
    async updateMessageStatus(@Req() request: Request,
        @Body() message:Message, 
        @Query() query)
        : Promise<IResponseFormat | any> {
            const {id,state} = query
            let formatted_response: IResponseFormat;
            const newMessageDTO = new NewMessageDTO();
            const default_message = ({
                ...newMessageDTO,
                ...message
            })

            try {
                let response = await 
                    this
                    .messageService
                    .getMessageById(id)
                
                    // check if message_id is valid
                    if (!response)
                    throw new NotFoundException
                        (`ID ${id} doesn't exist.`)

                const def_message = {
                    ...default_message,
                    recipient: {
                        ...default_message.recipient,
                        menu : state === "starred" ? 
                            MENU.starred : 
                            MENU.important
                    }
                }

                await this.messageService.updateMessage(id, def_message)

                formatted_response = formatResponse
                    (def_message, true, `Message set to ${state}`)

            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status)
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("setMenuState", query, formatted_response)
            )

            return formatted_response
    }

    //http://localhost:3000/api/messages/search?keyword=abc123
    @UseGuards(AuthTokenGuard)
    @Get("search")
    async search(@Req() request: Request,
        @Query() query): Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            let response_data: any;

            try {
                const cookie = await this.jwtService.verifyAsync(request.cookies["jwt"]);
            
                response_data = await 
                    this
                    .searchService
                    .search(query.keyword, cookie.email,"inbox");

                let response_data_length: number = 
                    response_data._responses.length;
                
            
                if (response_data_length > 0) {
                    response_data = response_data._responses[0].r;
                }
                       
                formatted_response = formatResponse
                    (  
                        (response_data_length > 0) ? response_data : null, 
                        true, 
                        "Success"
                    )
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.statusMessage)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("search", query, formatted_response)
            )
            
            return formatted_response;
    }

    async updateReadUnread(message_id: string): Promise<Message> {
        return await this.messageService.updateReadUnread(message_id)
    }   
}

export default MessageController;
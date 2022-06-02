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
import { Request } from "express";
import MessageService from "./message.service";
import { formatResponse, formatLogs, setDateTime } from "src/common/common.functions";
import LoggerService from "src/services/logger.service";
import { UserService } from "src/users/user.service";
import { 
    isValidMenu,
    STATE,
    MENU,
    MENU_ARRAY,
    isValidStatus
} from "./message.common";
import { AuthTokenGuard } from "src/guards/auth-token/auth-token.guard";
import { NewMessageDTO } from "./message.dto";
import { SearchService } from "src/common/search/search.service";
import { PaginationService } from "src/common/pagination/pagination.service";
import { omit } from "lodash";
import { TFilteredQuery } from "./message.interface";
import Message from "./message.entity";

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

            let filtered: TFilteredQuery;
            let menu = query.menu ? query.menu : "inbox";
            let formatted_response: IResponseFormat;
            let page_number = (query.page !== undefined) ? 
                Number(query.page) : 1;

            try {
                if (isValidMenu(menu)) {
                    // Get cookie data
                    const cookie = await this
                        .jwtService
                        .verifyAsync(request.cookies["jwt"]);
                    
                    const email: string = cookie.email;
                    
                    if (menu === "sent" || menu === "drafts") {
                        filtered = {"sender": {"email": email,
                            "menu": menu === "sent" ? 
                            MENU.sent : 
                            MENU.drafts
                            }
                        }
                    }
                    else {
                        filtered = {"recipient": {"email": email} }
                        if (menu !== "inbox")
                            filtered.recipient.menu = (menu === "starred") ?
                                MENU.starred : 
                                MENU.important;
                    }
                    // Retrieve and paginate data
                    let response = await this
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
    @Get(":menu/details/:id")
    async getMessageDetails(@Req() request: Request,
        @Param() param)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;
            let filtered: TFilteredQuery;
            
            try {   
                const {menu, id} = param;
                // get cookie
                const cookie = await this.jwtService.verifyAsync
                    (request.cookies["jwt"])

                if (menu === "sent" || menu === "drafts")
                    filtered = { id,
                        sender: { email: cookie.email }
                    }
                else
                    filtered = { id,
                        recipient: { email: cookie.email }
                    }

                // Check if message id exists
                let response = await this
                    .messageService
                    .getMessageDetails(filtered)
                
                if (Object.keys(response._responses).length === 0)
                    formatted_response = formatResponse
                        (null, true, "Success.");
                else {
                    response = response.next()._settledValue;
                    formatted_response = await this
                        .messageService
                        .updateReadUnread(response.id)
                            .then( result => {
                                return formatResponse
                                (result.changes[0].new_val, true, "Success.");
                            })
                }
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status)
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
        @Body() message: NewMessageDTO)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            const newMessageDTO = new NewMessageDTO();
            let default_message = ({
                ...newMessageDTO,
                ...message
            }) 
            
            try {
                // get cookie
                const cookie = await this.jwtService.verifyAsync
                    (request.cookies["jwt"]);

                // Check if recipient exist
                let recipient_data = await 
                    this
                    .userService
                    .getUserByEmail(message.recipient.email);
                
                if (Object.keys(recipient_data._responses).length < 1)
                    throw new NotFoundException
                        (`${message.recipient.email}`, "Recipient doesn't exist")   
                
                default_message = ({
                    ...default_message,
                    sender: {
                        ...default_message.sender,
                        email: cookie.email,
                        menu: MENU.sent
                    },
                    recipient: {
                        ...default_message.recipient,
                        menu: MENU.inbox
                    }
                })
        
                // insert to messages
                formatted_response = await this
                .messageService
                .sendMessage(default_message)
                    .then( result => {
                        return formatResponse(
                            result.changes[0].new_val, true, "Message Sent"
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
    async saveAsDraft(@Body() message: NewMessageDTO)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            const newMessageDTO = new NewMessageDTO();
            let default_message = ({
                ...newMessageDTO,
                ...message
            })

            try {
                // set status to draft
                default_message = ({
                    ...default_message,
                    status: STATE.draft,
                    sender: {
                        ...default_message.sender,
                        menu: MENU.drafts 
                    }
                })
                
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
    async updateDraftedMessage(@Body() message: NewMessageDTO,    
        @Query() query)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            let {...default_message} = message; 

            try {
                const {id} = query;
                // check if ID exists
                const response = await this
                    .messageService
                    .getMessageById(id)
                
                if (!response)
                    throw new NotFoundException
                        (`Message with ID ${id} doesn't exist`);

                // update update_date
                default_message.updated_date = setDateTime();
               
                formatted_response = await this
                    .messageService
                    .updateMessage(id,default_message)
                        .then( result => {
                            return formatResponse
                                (result.changes, true, "Message updated.")
                        })
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.statusMessage)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("updateMessage", default_message, formatted_response)
            )
                        
            return formatted_response;
    }

    // http://localhost:3000/api/messages/drafts/send?id=123abc
    @UseGuards(AuthTokenGuard)
    @Put("drafts/send")
    async sendDraftMessage(@Body() message: NewMessageDTO,
        @Query() query)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            const newMessageDTO = new NewMessageDTO();
            let default_message = ({
                ...newMessageDTO,
                ...message
            });

            try {
                const {id} = query;

                // check if id exists
                const response = await this
                    .messageService
                    .getMessageById(id)
                
                if (!response)
                    throw new NotFoundException
                        (`Message with ID: ${id} doesn't exist`)
                
                default_message = ({
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
                    created_date: setDateTime(),
                    updated_date: setDateTime()
                })

                formatted_response = await this
                    .messageService
                    .updateMessage(id, default_message)
                        .then( result => {
                            return formatResponse
                                (result.changes[0].new_val, true, "Message Sent.")
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
    async deleteMessage(@Param() param, 
        @Query() query)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;

            try {           
                // check if menu is valid
                if (!MENU_ARRAY.includes(param.menu))
                    throw new BadRequestException
                        (`Menu ${param.menu} doesn't exist.`)

                // check if id exists
                if (!await this.messageService.getMessageById(query.id))
                    throw new NotFoundException
                        (`Message with ID ${query.id} doesn't exist.`)

                formatted_response = await this
                    .messageService
                    .deleteMessage(query.id)
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
    async replyToMessage(@Req() request: Request,
        @Query() query,
        @Body() message: NewMessageDTO)
        : Promise<IResponseFormat> {

            let omitted_message: NewMessageDTO;
            let formatted_response: IResponseFormat;
            const newMessageDTO = new NewMessageDTO();
            let default_message = omit(message, ['id'])
            default_message = ({
                ...newMessageDTO,
                ...message
            })

            try {
                //get cookie
                const cookie = await this.jwtService.verifyAsync
                    (request.cookies["jwt"]);

                // check if query.id is a valid id
                if (!await this.messageService.getMessageById(query.id))
                    throw new HttpException
                        (`Message ID ${query.id} doesn't exist`, 404)

                // Set message details
                default_message = ({
                    ...default_message,
                    message_origin_id: (!default_message.message_origin_id) ?
                        query.id : 
                        default_message.message_origin_id,
                    subject: (!default_message.message_origin_id) ? 
                        `RE: ${default_message.subject}` :
                        default_message.subject,
                    recipient: {
                        ...default_message.recipient,
                        email: default_message.sender.email,
                        menu: MENU.inbox,
                    },
                    sender: {
                        ...default_message.sender,
                        email: cookie.email,
                        menu: MENU.sent,
                    },
                    status: 0,
                    updated_date: setDateTime()
                })
                
                omitted_message = omit(default_message, ['id'])
                // Send message to recipient's INBOX
                formatted_response = await this
                    .messageService
                    .sendMessage(omitted_message)
                    .then( result => {
                        return formatResponse
                            (omitted_message, true, "Reply sent.")
                    })
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status);
            }
            
            this
            .loggerService
            .insertLogs(formatLogs
                ("replyToMessage",omitted_message, formatted_response)
            );

            return formatted_response;
    }

    // http://localhost:3000/api/messages/inbox?id=123abc&status=starred
    @UseGuards(AuthTokenGuard)
    @Put("inbox")
    async updateMessageStatus(@Query() query)
        : Promise<IResponseFormat | any> {

            let formatted_response: IResponseFormat;
            let default_message: NewMessageDTO;

            try {
                const {id, status} = query;
                let response = await this
                    .messageService
                    .getMessageById(id)

                // check if id or status is valid
                if (!response || !isValidStatus(status))
                    throw new NotFoundException
                        (`ID [${id}] or Status [${status}] is invalid.`)
                
                default_message = response;
                default_message = {
                    ...default_message,
                    recipient: {
                        ...default_message.recipient,
                        menu : status === "starred" ? 
                            MENU.starred : 
                            MENU.important
                    },
                    updated_date: setDateTime()
                }
               
                // update message status
                formatted_response = await this
                    .messageService
                    .updateMessage(id, default_message)
                        . then( result => {
                            return formatResponse
                                (   
                                    result.changes[0].new_val, 
                                    true, 
                                    `Message set to ${status}`
                                )
                        })
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
                // get cookie
                const cookie = await this
                    .jwtService
                    .verifyAsync(request.cookies["jwt"]);
            
                response_data = await 
                    this
                    .searchService
                    .search(query.keyword, cookie.email);

                let response_data_length: number = 
                    response_data._responses.length;
                
            
                if (response_data_length > 0)
                    response_data = response_data._responses[0].r;
                       
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
}

export default MessageController;
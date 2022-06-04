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
                    filtered = {

                    }
                    
                    // Retrieve and paginate data
                    const response = await this
                        .messageService
                        .checkMessageInMenu({
                            reference: cookie.email,
                            menu: MENU[menu]
                        })
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
            } catch (error: any) {
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
            let return_data: any;
            try {   
                const {menu, id} = param;
                // get cookie
                const cookie = await this.jwtService.verifyAsync
                    (request.cookies["jwt"])

                let response:any = await this
                        .messageService
                        .checkMessageInMenu({
                            id,
                            reference: cookie.email,
                            menu: MENU[menu]
                        })
                
                if (!response.length)
                    throw new NotFoundException
                        (`Message ID [${id}] doesn't exist in ${menu} menu`);
                
                return_data = response[0];
                if (return_data.status === 0) {
                    const data = ({
                        ...response[0],
                        status: STATE.read,
                        updated_date: setDateTime()
                    })

                    return_data = await this
                    .messageService
                    .updateReadUnread(data.id,data)
                        .then( result => {
                            return result.changes[0].new_val
                        })
                }

                formatted_response = formatResponse
                    (return_data, true, "Success.");

                
                console.log(response)
            } catch (error: any) {
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
                let recipient_data = await this
                    .userService
                    .getUserByEmail(message.recipient.email);
                
                if (!recipient_data[0])
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
            } catch (error: any) {
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
            } catch (error: any) {
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
            } catch (error: any) {
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
                    console.log(response)
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
            } catch (error: any) {
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

    // http://localhost:3000/api/messages/menu/delete?id=123abc
    @UseGuards(AuthTokenGuard)
    @Delete(":menu/delete")
    async deleteMessage(@Req() request: Request, 
        @Param() param, @Query() query)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;

            try {           
                //get cookie
                const cookie = await this
                    .jwtService
                    .verifyAsync(request.cookies["jwt"]);

                // check if message exists in menu
                const response = await this.messageService.checkMessageInMenu({
                        id: query.id,
                        reference: cookie.email,
                        menu: MENU[param.menu]
                    })

                if (!response.length)
                    throw new NotFoundException
                        (`Message ID [${query.id}] doesn't exist in ${param.menu} menu.`)

                formatted_response = await this
                    .messageService
                    .deleteMessage(query.id)
                        .then(result => {
                            return formatResponse
                                (result, true, "Message Deleted")
                        });
            } catch (error: any) {
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
    @Post(":menu/reply")
    async replyToMessage(@Req() request: Request,
        @Param() param,
        @Query() query,
        @Body() message: NewMessageDTO)
        : Promise<IResponseFormat> {

            let omitted_message: NewMessageDTO = new NewMessageDTO();
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

                // check if message exists in menu
                const response = await this.messageService.checkMessageInMenu({
                    id: query.id,
                    reference: cookie.email,
                    menu: MENU[param.menu]
                })

                if (!response.length)
                    throw new NotFoundException
                        (`Message ID [${query.id}] doesn't exist in ${param.menu} menu`)
               
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
                    created_date: setDateTime(),
                    updated_date: setDateTime()
                })  

                // omit id from message
                omitted_message = omit(default_message, ['id'])
             
                // Send message to recipient's INBOX
                formatted_response = await this
                    .messageService
                    .sendMessage(omitted_message)
                    .then( result => {
                        return formatResponse
                            (omitted_message, true, "Reply sent.")
                    })
            } catch (error: any) {
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
    @Put(":menu")
    async updateMessageStatus(@Query() query,
        @Param() param, 
        @Req() request: Request)
        : Promise<IResponseFormat | any> {

            let formatted_response: IResponseFormat;
            let default_message: NewMessageDTO;

            try {
                const menu = param.menu;
                const {id, status} = query;

                // get cookie
                const cookie = await this.jwtService
                    .verifyAsync(request.cookies["jwt"])

                const response = await this
                    .messageService
                    .checkMessageInMenu({
                        id,
                        reference: cookie.email,
                        menu: MENU[menu]
                    })

                // check if message exists in specified menu
                if (!response.length)
                    throw new NotFoundException
                        (`Cannot find message with ID [${id}] in [${menu}]`)
                
                // check if status is valid
                if (!isValidStatus(status))
                    throw new NotFoundException
                        (`Status [${status}] is invalid.`)
                
                default_message = response[0];
                default_message = {
                    ...default_message,
                    [menu === "inbox" ? "recipient" : "sender"]: {
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
            } catch (error: any) {
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
}

export default MessageController;
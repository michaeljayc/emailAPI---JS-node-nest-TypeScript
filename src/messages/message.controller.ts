import { Body, Controller, ForbiddenException, Get, Logger, Param, Post, Query, Req } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ResponseFormat } from "src/common/common";
import Message from "./message.entity";
import { query, Request, response } from "express";
import MessageService from "./message.service";
import * as common from "src/common/common";
import LoggerService from "src/Services/logger.service";
import { format } from "path/posix";
import { UserService } from "src/users/user.service";

@Controller("messages")
export class MessageController {

    constructor(private readonly messageService: MessageService,
        private readonly jwtService:JwtService,
        private readonly loggerService: LoggerService,
        private readonly userService: UserService){}

    @Get()
    async getMessages(@Req() request: Request,
        @Query() query): Promise<ResponseFormat> {
           
            let menu = query.menu ? Number(query.menu) : 1 
            let formatted_response: ResponseFormat;
            const cookie = request.cookies["jwt"];

            //If not logged-in, forbid access
            if (!cookie)
                throw new ForbiddenException;
            
            const user_data = await this.jwtService.verifyAsync(cookie);
            let response = await this.messageService.getMessages(user_data.id, menu)
                .then( result => {
                    formatted_response = common.formatResponse(result, true, "Success");
                })
            
            this.loggerService.insertLogs(common.formatLogs("getMessages", query, formatted_response))
            
            return formatted_response;
        }
    
    @Post("new")
    async createMessage(@Req() request: Request,
        @Body() message: Message): Promise<ResponseFormat> {
            
            let response: any;
            let formatted_response: ResponseFormat;
            const cookie = request.cookies["jwt"];
            if (!cookie)
                throw new ForbiddenException;

            let recipient_data = await this.userService.getUserByEmail(message.recipient);
            if (Object.keys(recipient_data._responses).length > 0)
                recipient_data = recipient_data.next()._settledValue;

            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());

            if (message.isDraft)
                formatted_response = common.formatResponse(
                    [message], true, "Saved as draft.")

            if (message.menu_state === 4) {
                response = await this.messageService.createMessage(message)
                if (response.inserted === 1) {
                    formatted_response = common.formatResponse([response], true, "Message sent.")
                }
            }
            
            this.loggerService.insertLogs(common.formatLogs("createMessage", message, formatted_response))
            return formatted_response;
            return
    }

    @Get(":message_id")
    async getMessageDetails(@Req() request: Request,
        @Param() param): Promise<ResponseFormat> {

            const message_id = param.message_id;
            const cookie = request.cookies["jwt"];

            if (!cookie)
                throw new ForbiddenException;
            
            let response = await this.messageService.getMessageDetails(message_id)
                .then( result => {
                    return common.formatResponse([result], true, "Success");
                })
                .catch( error => {
                    return common.formatResponse([error], false)
                })
            
            
            this.loggerService.insertLogs(
                common.formatLogs("getMessageDetails",
                    param,
                    response))
            return response;
    }

    
}

export default MessageController;
import { JwtService } from "@nestjs/jwt";
import { ResponseFormat } from "src/common/common";
import Message from "./message.entity";
import { Request } from "express";
import MessageService from "./message.service";
import LoggerService from "src/Services/logger.service";
import { UserService } from "src/users/user.service";
export declare class MessageController {
    private readonly messageService;
    private readonly jwtService;
    private readonly loggerService;
    private readonly userService;
    constructor(messageService: MessageService, jwtService: JwtService, loggerService: LoggerService, userService: UserService);
    getMessages(request: Request, query: any): Promise<ResponseFormat>;
    sendMessage(request: Request, message: Message): Promise<ResponseFormat>;
    saveAsDraft(request: Request, message: Message): Promise<ResponseFormat>;
    getMessageDetails(request: Request, param: any): Promise<ResponseFormat>;
    updateMessage(request: Request, message: Message, query: any): Promise<ResponseFormat>;
    deleteMessage(request: Request, param: any, query: any): Promise<ResponseFormat>;
    updateReadUnread(message: Message): Promise<Message>;
}
export default MessageController;

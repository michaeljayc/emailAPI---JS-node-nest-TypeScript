import { JwtService } from "@nestjs/jwt";
import { IResponseFormat } from "../common/common.interface";
import Message from "./message.entity";
import { Request } from "express";
import MessageService from "./message.service";
import LoggerService from "src/services/logger.service";
import { UserService } from "src/users/user.service";
export declare class MessageController {
    private readonly messageService;
    private readonly jwtService;
    private readonly loggerService;
    private readonly userService;
    constructor(messageService: MessageService, jwtService: JwtService, loggerService: LoggerService, userService: UserService);
    getMessages(request: Request, query: any): Promise<IResponseFormat | any>;
    getMessageDetails(request: Request, param: any): Promise<IResponseFormat>;
    sendMessage(request: Request, message: Message): Promise<IResponseFormat>;
    saveAsDraft(request: Request, message: Message): Promise<IResponseFormat>;
    updateDraftedMessage(request: Request, message: Message, query: any): Promise<IResponseFormat>;
    deleteMessage(request: Request, param: any, query: any): Promise<IResponseFormat>;
    replyToMessage(request: Request, query: any, message: Message): Promise<IResponseFormat>;
    setMenuState(request: Request, param: any, query: any): Promise<IResponseFormat | any>;
    updateReadUnread(message_id: string): Promise<Message>;
}
export default MessageController;

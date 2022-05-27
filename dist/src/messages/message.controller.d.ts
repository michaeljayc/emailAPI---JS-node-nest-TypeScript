import { JwtService } from "@nestjs/jwt";
import { IResponseFormat } from "../common/common.interface";
import Message from "./message.entity";
import { Request } from "express";
import MessageService from "./message.service";
import LoggerService from "src/services/logger.service";
import { UserService } from "src/users/user.service";
import { SearchService } from "src/common/search/search.service";
import { PaginationService } from "src/common/pagination/pagination.service";
export declare class MessageController {
    private readonly messageService;
    private readonly jwtService;
    private readonly loggerService;
    private readonly userService;
    private readonly searchService;
    private readonly paginationService;
    constructor(messageService: MessageService, jwtService: JwtService, loggerService: LoggerService, userService: UserService, searchService: SearchService, paginationService: PaginationService);
    getMessages(request: Request, query: any): Promise<IResponseFormat | any>;
    getMessageDetails(request: Request, param: any): Promise<IResponseFormat>;
    sendMessage(request: Request, message: Message): Promise<IResponseFormat>;
    saveAsDraft(request: Request, message: Message): Promise<IResponseFormat>;
    updateDraftedMessage(request: Request, message: Message, query: any): Promise<IResponseFormat>;
    deleteMessage(request: Request, param: any, query: any): Promise<IResponseFormat>;
    replyToMessage(query: any, message: Message): Promise<IResponseFormat>;
    setMenuState(request: Request, param: any, query: any): Promise<IResponseFormat | any>;
    search(request: Request, query: any): Promise<IResponseFormat>;
    updateReadUnread(message_id: string): Promise<Message>;
}
export default MessageController;

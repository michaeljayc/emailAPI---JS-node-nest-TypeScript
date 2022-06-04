import { JwtService } from "@nestjs/jwt";
import { IResponseFormat } from "../common/common.interface";
import { Request } from "express";
import MessageService from "./message.service";
import LoggerService from "src/services/logger.service";
import { UserService } from "src/users/user.service";
import { NewMessageDTO } from "./message.dto";
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
    sendMessage(request: Request, message: NewMessageDTO): Promise<IResponseFormat>;
    saveAsDraft(message: NewMessageDTO): Promise<IResponseFormat>;
    updateDraftedMessage(message: NewMessageDTO, query: any): Promise<IResponseFormat>;
    sendDraftMessage(message: NewMessageDTO, query: any): Promise<IResponseFormat>;
    deleteMessage(request: Request, param: any, query: any): Promise<IResponseFormat>;
    replyToMessage(request: Request, param: any, query: any, message: NewMessageDTO): Promise<IResponseFormat>;
    updateMessageStatus(query: any, param: any, request: Request): Promise<IResponseFormat | any>;
}
export default MessageController;

import { UserService } from "./user.service";
import { LoggerService } from "src/services/logger.service";
import { User } from "./user.entity";
import { IResponseFormat } from "src/common/common.interface";
import { Request } from "express";
export declare class UserController {
    private userService;
    private loggerService;
    private readonly logger;
    constructor(userService: UserService, loggerService: LoggerService);
    getAllUsers(request: Request): Promise<IResponseFormat>;
    getUser(request: Request, param: any): Promise<IResponseFormat>;
    editUser(request: Request, param: any): Promise<IResponseFormat>;
    updateUser(request: Request, user: User, param: any): Promise<IResponseFormat>;
    deleteUser(query: any): Promise<IResponseFormat>;
}

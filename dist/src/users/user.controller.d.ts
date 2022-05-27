import { UserService } from "./user.service";
import { LoggerService } from "src/services/logger.service";
import { User } from "./user.entity";
import { IResponseFormat } from "src/common/common.interface";
import { Request } from "express";
import AuthService from "src/auth/auth.service";
import { PaginationService } from "src/common/pagination/pagination.service";
export declare class UserController {
    private userService;
    private loggerService;
    private authService;
    private paginationService;
    constructor(userService: UserService, loggerService: LoggerService, authService: AuthService, paginationService: PaginationService);
    getAllUsers(request: Request, query: any): Promise<IResponseFormat>;
    getUserDetails(request: Request, param: any): Promise<IResponseFormat>;
    create(user: User): Promise<IResponseFormat>;
    editUser(request: Request, param: any): Promise<IResponseFormat>;
    updateUser(user: User, query: any): Promise<IResponseFormat>;
    deleteUser(query: any): Promise<IResponseFormat>;
}

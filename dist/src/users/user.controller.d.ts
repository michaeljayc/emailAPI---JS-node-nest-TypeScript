import { UserService } from "./user.service";
import { LoggerService } from "src/services/logger.service";
import { AuthService } from "src/auth/auth.service";
import { User } from "./user.entity";
import { IResponseFormat } from "src/common/common.interface";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
export declare class UserController {
    private userService;
    private loggerService;
    private authService;
    private jwtService;
    private readonly logger;
    constructor(userService: UserService, loggerService: LoggerService, authService: AuthService, jwtService: JwtService);
    getAllUsers(request: Request): Promise<IResponseFormat>;
    getUser(request: Request, param: any): Promise<IResponseFormat>;
    editUser(request: Request, param: any): Promise<IResponseFormat>;
    updateUser(request: Request, user: User, param: any): Promise<IResponseFormat>;
    deleteUser(query: any): Promise<IResponseFormat>;
}

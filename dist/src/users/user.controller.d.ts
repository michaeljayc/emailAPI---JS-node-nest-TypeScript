import { UserService } from "./user.service";
import { LoggerService } from "src/Services/logger.service";
import { AuthService } from "src/auth/auth.service";
import { User } from "./user.entity";
import * as common from "src/common/common";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
export declare class UserController {
    private userService;
    private loggerService;
    private authService;
    private jwtService;
    private readonly logger;
    constructor(userService: UserService, loggerService: LoggerService, authService: AuthService, jwtService: JwtService);
    registerUser(user: User): Promise<common.ResponseFormat>;
    loginUser(credentials: common.loginCredentials, response: Response): Promise<common.ResponseFormat>;
    getUser(request: Request): Promise<common.ResponseFormat>;
    getAllUsers(): Promise<common.ResponseFormat>;
    editUser(request: Request, param: any): Promise<common.ResponseFormat>;
    updateUser(id: string, user: User, request: Request): Promise<common.ResponseFormat>;
    deleteUser(param: any, request: Request): Promise<common.ResponseFormat>;
    logoutUser(response: Response): Promise<{
        message: string;
    }>;
}

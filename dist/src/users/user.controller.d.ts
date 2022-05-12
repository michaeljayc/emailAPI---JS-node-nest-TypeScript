import { UserService } from "./user.service";
import { LoggerService } from "src/Services/logger.service";
import { AuthService } from "src/auth/auth.service";
import { User } from "./user.entity";
import { IResponseFormat } from "src/common/common.interface";
import { TLoginCredentials } from "./user.types";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
export declare class UserController {
    private userService;
    private loggerService;
    private authService;
    private jwtService;
    private readonly logger;
    constructor(userService: UserService, loggerService: LoggerService, authService: AuthService, jwtService: JwtService);
    registerUser(user: User): Promise<IResponseFormat | any>;
    loginUser(credentials: TLoginCredentials, response: Response): Promise<IResponseFormat | any>;
    getUser(request: Request): Promise<IResponseFormat>;
    getAllUsers(): Promise<IResponseFormat>;
    editUser(request: Request, param: any): Promise<IResponseFormat>;
    updateUser(user: User, request: Request): Promise<IResponseFormat>;
    deleteUser(query: any): Promise<IResponseFormat>;
    logoutUser(response: Response): Promise<IResponseFormat>;
}

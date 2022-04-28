import { UserService } from "./user.service";
import { LoggerService } from "src/Services/logger.service";
import { User } from "./user.entity";
import * as common from "src/common/common";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
export declare class UserController {
    private userService;
    private loggerService;
    private jwtService;
    private readonly logger;
    constructor(userService: UserService, loggerService: LoggerService, jwtService: JwtService);
    getAllUsers(): Promise<common.ResponseFormat>;
    registerUser(user: User): Promise<common.ResponseFormat>;
    loginUser(credentials: common.loginCredentials, response: Response): Promise<common.ResponseFormat>;
    getUser(request: Request): Promise<common.ResponseFormat>;
}

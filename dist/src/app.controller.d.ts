import { JwtService } from '@nestjs/jwt';
import AuthService from './auth/auth.service';
import { IResponseFormat } from './common/common.interface';
import LoggerService from './services/logger.service';
import User from './users/user.entity';
import { UserService } from './users/user.service';
import { TLoginCredentials } from './users/user.types';
import { Response } from "express";
export declare class AppController {
    private authService;
    private userService;
    private loggerService;
    private jwtService;
    constructor(authService: AuthService, userService: UserService, loggerService: LoggerService, jwtService: JwtService);
    registerUser(user: User): Promise<IResponseFormat | any>;
    loginUser(credentials: TLoginCredentials, response: Response): Promise<IResponseFormat | any>;
    logoutUser(request: Request, response: Response): Promise<IResponseFormat>;
}

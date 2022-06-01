import { JwtService } from '@nestjs/jwt';
import AuthService from './auth/auth.service';
import { IResponseFormat } from './common/common.interface';
import LoggerService from './services/logger.service';
import User from './users/user.entity';
import { Response } from "express";
import { UserLoginDTO } from './users/user.dto';
export declare class AppController {
    private authService;
    private loggerService;
    private jwtService;
    constructor(authService: AuthService, loggerService: LoggerService, jwtService: JwtService);
    registerUser(user: User): Promise<IResponseFormat | any>;
    loginUser(credentials: UserLoginDTO, response: Response): Promise<IResponseFormat | any>;
    logoutUser(response: Response): Promise<IResponseFormat>;
}

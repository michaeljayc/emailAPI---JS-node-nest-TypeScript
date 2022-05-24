import { JwtService } from '@nestjs/jwt';
import AuthService from './auth/auth.service';
import { IResponseFormat } from './common/common.interface';
import LoggerService from './services/logger.service';
import { UserService } from './users/user.service';
import { Response } from "express";
import { UserLoginDTO, UserRegisterDTO } from './users/user.dto';
export declare class AppController {
    private authService;
    private userService;
    private loggerService;
    private jwtService;
    constructor(authService: AuthService, userService: UserService, loggerService: LoggerService, jwtService: JwtService);
    registerUser(user: UserRegisterDTO): Promise<IResponseFormat | any>;
    loginUser(credentials: UserLoginDTO, response: Response): Promise<IResponseFormat | any>;
    logoutUser(request: Request, response: Response): Promise<IResponseFormat>;
}

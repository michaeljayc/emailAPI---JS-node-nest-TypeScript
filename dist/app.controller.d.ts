import { JwtService } from '@nestjs/jwt';
import AuthService from './auth/auth.service';
import { IResponseFormat } from './common/common.interface';
import LoggerService from './services/logger.service';
import User from './users/user.entity';
import { Response, Request } from "express";
import { UserLoginDTO } from './users/user.dto';
import { DatabaseService } from './database/database.service';
export declare class AppController {
    private authService;
    private loggerService;
    private jwtService;
    private databaseService;
    constructor(authService: AuthService, loggerService: LoggerService, jwtService: JwtService, databaseService: DatabaseService);
    onModuleInit(): Promise<void>;
    registerUser(user: User): Promise<IResponseFormat | any>;
    loginUser(request: Request, credentials: UserLoginDTO, response: Response): Promise<IResponseFormat | any>;
    logoutUser(request: Request, response: Response): Promise<IResponseFormat>;
}

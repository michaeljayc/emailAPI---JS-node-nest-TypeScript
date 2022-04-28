import { UserService } from "src/Services/user.service";
import { LoggerService } from "src/Services/logger.service";
import { User } from "../Entities/user.entity";
import * as common from "src/common/common";
export declare class UserController {
    private userService;
    private loggerService;
    private readonly logger;
    constructor(userService: UserService, loggerService: LoggerService);
    getAllUsers(): Promise<common.ResponseFormat>;
    registerUser(user: User): Promise<common.ResponseFormat>;
    loginUser(credentials: common.loginCredentials): Promise<common.ResponseFormat>;
}

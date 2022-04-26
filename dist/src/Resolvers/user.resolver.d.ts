import { UserService } from "src/Services/user.service";
import { User } from "../Entities/user.entity";
import * as common from "src/common/common";
export declare class UserResolver {
    private userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<User>;
    registerUser(user: User): Promise<string>;
    loginUser(credentials: common.LoginCredentials): Promise<common.ResponseFormat>;
}

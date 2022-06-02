import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";
import * as rethink from "rethinkdbdash";
export declare class AuthService {
    private userService;
    private connection;
    constructor(userService: UserService, connection: any);
    register(user: User): Promise<rethink.WriteResult>;
    login(login_email: string): Promise<User>;
    ecnryptPassword(password: string): Promise<string>;
    comparePassword(newPassword: string, passwordHash: string): Promise<any>;
}
export default AuthService;

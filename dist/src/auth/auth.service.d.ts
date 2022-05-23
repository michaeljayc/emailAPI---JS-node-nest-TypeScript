import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";
export declare class AuthService {
    private userService;
    constructor(userService: UserService);
    validateUser(credentials: any): Promise<any>;
    login(user: User): Promise<any>;
    ecnryptPassword(password: string): Promise<string>;
    comparePassword(newPassword: string, passwordHash: string): Promise<any>;
}
export default AuthService;

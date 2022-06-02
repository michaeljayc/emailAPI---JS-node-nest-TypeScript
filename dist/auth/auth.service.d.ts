import User from "src/users/user.entity";
import * as rethink from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";
export declare class AuthService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    register(user: User): Promise<rethink.WriteResult>;
    login(login_email: string): Promise<User>;
    ecnryptPassword(password: string): Promise<string>;
    comparePassword(newPassword: string, passwordHash: string): Promise<any>;
}
export default AuthService;

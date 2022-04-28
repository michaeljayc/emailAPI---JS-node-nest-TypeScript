import { User } from "./user.entity";
import * as rethink from "rethinkdb";
import * as common from "src/common/common";
export declare class UserService {
    private connection;
    constructor(connection: any);
    getAllUsers(): Promise<User>;
    getUserById(id: string): Promise<User>;
    getUserByEmail(credentials: common.loginCredentials): Promise<any>;
    registerUser(user: User): Promise<rethink.WriteResult>;
    loginUser(id: string): Promise<User>;
}

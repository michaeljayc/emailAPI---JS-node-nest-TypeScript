import { User } from "./user.entity";
import * as rethink from "rethinkdb";
import * as common from "src/common/common";
export declare class UserService {
    private connection;
    constructor(connection: any);
    registerUser(user: User): Promise<rethink.WriteResult>;
    loginUser(id: string): Promise<User>;
    getAllUsers(): Promise<User>;
    getUserById(id: string): Promise<User>;
    getUserByUsername(username: string): Promise<any>;
    getUserByEmail(credentials: common.loginCredentials): Promise<any>;
    updateUser(user: User): Promise<rethink.WriteResult>;
    deleteUser(id: string): Promise<rethink.WriteResult>;
}

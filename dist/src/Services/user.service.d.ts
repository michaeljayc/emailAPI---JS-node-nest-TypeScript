import { User } from "../Entities/user.entity";
import * as rethink from "rethinkdb";
import * as common from "src/common/common";
export declare class UserService {
    private connection;
    constructor(connection: any);
    getAllUsers(): Promise<User>;
    getUserByEmail(credentials: common.LoginCredentials): Promise<any>;
    registerUser(user: User): Promise<rethink.WriteResult>;
    loginUser(id: string): Promise<User>;
}

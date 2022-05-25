import { User } from "./user.entity";
import * as rethink from "rethinkdb";
export declare class UserService {
    private connection;
    constructor(connection: any);
    getAllUsers(): Promise<User>;
    getUserById(id: string): Promise<User>;
    getUserByUsername(username: string): Promise<any>;
    getUserByEmail(email: string): Promise<any>;
    updateUser(user: User, user_id: string): Promise<rethink.WriteResult>;
    deleteUser(id: string): Promise<rethink.WriteResult>;
}

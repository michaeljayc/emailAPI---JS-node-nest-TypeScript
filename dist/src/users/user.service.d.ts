import { User } from "./user.entity";
import * as rethink from "rethinkdb";
export declare class UserService {
    private connection;
    constructor(connection: any);
    createNewUser(user: User): Promise<rethink.WriteResult>;
    getAllUsers(): Promise<User>;
    getUserById(uuid: string): Promise<User>;
    getUserByEmail(email: string): Promise<any>;
    updateUser(user: User, user_id: string): Promise<rethink.WriteResult>;
    deleteUser(id: string): Promise<rethink.WriteResult>;
}

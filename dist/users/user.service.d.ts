import { User } from "./user.entity";
import * as rethink from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";
export declare class UserService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    createNewUser(user: User): Promise<rethink.WriteResult>;
    getAllUsers(): Promise<rethink.WriteResult>;
    getUserById(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<any>;
    updateUser(user: User, user_id: string): Promise<rethink.WriteResult>;
    deleteUser(id: string): Promise<rethink.WriteResult>;
}

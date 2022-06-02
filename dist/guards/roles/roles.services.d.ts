import { DatabaseService } from "src/database/database.service";
import User from "src/users/user.entity";
export declare class RolesService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    getUserDataContext(data: any): Promise<User>;
}

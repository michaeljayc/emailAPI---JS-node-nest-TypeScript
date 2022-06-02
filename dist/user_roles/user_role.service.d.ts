import { UserRole } from "src/user_roles/user_role.entity";
import { DatabaseService } from "src/database/database.service";
export declare class UserRoleService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    getUserRoleById(id: string): Promise<UserRole>;
    getUserRoles(): Promise<UserRole>;
}

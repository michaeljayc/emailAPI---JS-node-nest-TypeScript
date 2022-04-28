import { UserRole } from "src/Entities/user_role.entity";
import { UserRoleService } from "src/Services/user_role.service";
export declare class UserRoleController {
    private userRoleService;
    constructor(userRoleService: UserRoleService);
    getUserRoles(): Promise<UserRole>;
}

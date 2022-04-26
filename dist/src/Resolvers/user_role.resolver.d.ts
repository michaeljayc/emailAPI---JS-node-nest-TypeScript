import { UserRole } from "src/Entities/user_role.entity";
import { UserRoleService } from "src/Services/user_role.service";
export declare class UserRoleResolver {
    private userRoleService;
    constructor(userRoleService: UserRoleService);
    getUserRoles(): Promise<UserRole>;
}

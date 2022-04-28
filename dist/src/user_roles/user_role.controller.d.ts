import { UserRole } from "src/user_roles/user_role.entity";
import { UserRoleService } from "../user_roles/user_role.service";
export declare class UserRoleController {
    private userRoleService;
    constructor(userRoleService: UserRoleService);
    getUserRoles(): Promise<UserRole>;
}

import { UserRole } from "src/user_roles/user_role.entity";
export declare class UserRoleService {
    private connection;
    constructor(connection: any);
    getUserRoleById(id: string): Promise<UserRole>;
    getUserRoles(): Promise<UserRole>;
}

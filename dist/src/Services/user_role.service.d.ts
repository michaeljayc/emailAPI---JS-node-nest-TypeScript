import { UserRole } from "src/Entities/user_role.entity";
export declare class UserRoleService {
    private connection;
    constructor(connection: any);
    getUserRoleById(id: string): Promise<UserRole>;
    getUserRoles(): Promise<UserRole>;
}

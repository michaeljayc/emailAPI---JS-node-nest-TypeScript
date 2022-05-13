import { Role } from "./role.enum";
export declare const ROLES_KEY = "roles";
export declare const RoleGuard: (role: Role) => import("@nestjs/common").CustomDecorator<string>;

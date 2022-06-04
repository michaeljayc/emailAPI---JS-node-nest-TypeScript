import { ROLE } from "./role.enum";
export declare const ROLES_KEY = "roles";
export declare const RoleGuard: (role: ROLE) => import("@nestjs/common").CustomDecorator<string>;

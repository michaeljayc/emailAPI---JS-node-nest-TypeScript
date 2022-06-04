import { SetMetadata } from "@nestjs/common";
import { ROLE } from "./role.enum";

export const ROLES_KEY = "roles";
export const RoleGuard = ( role: ROLE) => SetMetadata(ROLES_KEY, role);
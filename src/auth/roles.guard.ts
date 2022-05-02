import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../user_roles/role.decorator";
import { Role } from "../user_roles/role.enum";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector,
        private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        
        if (!requiredRole) {
          return true;
        }

        const user = context.switchToHttp().getRequest();
        let user_data = await this.authService.getUserData(user.body);
        if (Object.keys(user_data._responses).length !== 0) {
          user_data = user_data.next()._settledValue
        }
        return requiredRole === user_data.role_type_id;
    }
}
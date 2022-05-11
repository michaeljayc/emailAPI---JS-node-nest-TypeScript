import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../user_roles/role.decorator";
import { Role } from "../user_roles/role.enum";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector,
        private authService: AuthService,
        private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

        if (!requiredRole) {
          return true;
        }

        const data = context.switchToHttp().getRequest();
  
        if (!data.cookies.jwt)
          throw new ForbiddenException;

        let user_data = await this.jwtService.verifyAsync(data.cookies.jwt)
        let user = await this.authService.getUserData(user_data.email);
        
        if (Object.keys(user._responses).length !== 0) 
          user = user.next()._settledValue
        
        return requiredRole === user.role_type_id;
    }
}
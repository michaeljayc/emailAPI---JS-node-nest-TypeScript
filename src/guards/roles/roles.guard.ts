import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException, UnauthorizedException, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/user_roles/role.decorator";
import { Role } from "../../user_roles/role.enum";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/user.service";
import { RolesService } from "./roles.services";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector,
      private rolesService: RolesService,
      private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean | any> {

      try { 
        const requiredRole = this
        .reflector
        .getAllAndOverride<Role>(
          ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
          ]
        );
      
        if (!requiredRole) {
          return true;
        }

        const context_data = context.switchToHttp().getRequest();
        const data = await this.jwtService.verifyAsync(context_data.cookies.jwt)
        const user = await this.rolesService.getUserDataContext(data)

        if (requiredRole !== user.role_type_id)
          throw new UnauthorizedException()
        else 
          return true
      } catch (error) {
          throw new HttpException(error, error.statusCode)
      }

    }
}
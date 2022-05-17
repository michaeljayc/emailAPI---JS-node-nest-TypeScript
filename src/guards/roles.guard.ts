import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../user_roles/role.decorator";
import { Role } from "../user_roles/role.enum";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { formatResponse } from "src/common/common.functions";
import { IResponseFormat } from "src/common/common.interface";
import { response } from "express";
import { UserService } from "src/users/user.service";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector,
        private userService: UserService,
        private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      
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
      
      const data = context.switchToHttp().getRequest();

      try { 
        let user_data = await 
          this
          .jwtService
          .verifyAsync(data.cookies.jwt)

        let user = await 
          this
          .userService
          .getUserByEmail(user_data.email);
    
        if (Object.keys(user._responses).length !== 0) 
          user = user.next()._settledValue

        if (requiredRole !== user.role_type_id)
          throw new UnauthorizedException()
        else 
          return true

      } catch (error) {
          throw new HttpException(error, error.statusCode)
      }

    }
}
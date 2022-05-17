import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/user.service";
export declare class RolesGuard implements CanActivate {
    private reflector;
    private userService;
    private jwtService;
    constructor(reflector: Reflector, userService: UserService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

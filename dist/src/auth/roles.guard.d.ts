import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
export declare class RolesGuard implements CanActivate {
    private reflector;
    private authService;
    private jwtService;
    constructor(reflector: Reflector, authService: AuthService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

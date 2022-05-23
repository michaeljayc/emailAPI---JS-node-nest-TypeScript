import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { RolesService } from "./roles.services";
export declare class RolesGuard implements CanActivate {
    private reflector;
    private rolesService;
    private jwtService;
    constructor(reflector: Reflector, rolesService: RolesService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean | any>;
}

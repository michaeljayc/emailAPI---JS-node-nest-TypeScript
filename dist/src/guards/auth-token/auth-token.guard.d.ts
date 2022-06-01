import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenService } from "./auth-token.service";
export declare class AuthTokenGuard implements CanActivate {
    private authTokenService;
    private jwtService;
    constructor(authTokenService: AuthTokenService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

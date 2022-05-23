import { CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthTokenService } from "./auth-token.service";
export declare class AuthTokenGuard implements CanActivate {
    private authTokenService;
    constructor(authTokenService: AuthTokenService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

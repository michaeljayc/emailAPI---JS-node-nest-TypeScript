import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { formatResponse } from "src/common/common.functions";
import { UserService } from "src/users/user.service";
import { AuthTokenService } from "./auth-token.service";

@Injectable()
export class AuthTokenGuard implements CanActivate {

    constructor( private authTokenService: AuthTokenService){}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        //check for cookie  
        try {
            return await this.authTokenService.getContextData(context.getArgs()[1].req.cookies.jwt);
        } catch (error) {
            console.log(formatResponse
                (error, false, error.status));
                
            return false;
        }
    }

}
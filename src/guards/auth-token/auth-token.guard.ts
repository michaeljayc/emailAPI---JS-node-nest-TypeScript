import { CanActivate, ExecutionContext, ForbiddenException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { formatResponse } from "src/common/common.functions";
import { UserService } from "src/users/user.service";
import { AuthTokenService } from "./auth-token.service";

@Injectable()
export class AuthTokenGuard implements CanActivate {

    constructor( private authTokenService: AuthTokenService,
        private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        try {
            const req_data = context.getArgs()[1]
            const hasCookie = await this.authTokenService.getContextData(req_data.req.cookies.jwt);
            const cookie = await this.jwtService.verifyAsync(req_data.req.cookies.jwt)
            // if (cookie.username === req_data.req.params.username) {
            //     return hasCookie
            // } else {
            //     console.log("error")
            // }
            return hasCookie;
        } catch (error) {
            console.log(formatResponse
                (error, false, error.status));
                
            return false;
        }
    }

}
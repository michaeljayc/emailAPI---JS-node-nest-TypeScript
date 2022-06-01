import { CanActivate, ExecutionContext, ForbiddenException, forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
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
            return await this.authTokenService.getContextData(req_data.req.cookies.jwt);
        } catch (error) {
            console.log(formatResponse(null,false, error))
            throw new HttpException(error, error.statusCode)
        }
    }

}
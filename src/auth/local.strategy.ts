import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import AuthService from "./auth.service";
import { Request } from "@nestjs/common";
import { TLoginCredentials } from "src/users/user.types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService){
        super();
    }

    async validate(credentials): Promise<any> {
        
        // console.log(credentials)
        // const user = await 
        //     this
        //     .authService
        //     .validateUser(email,password);
        
        // if (!user) {
        //     throw new UnauthorizedException();
        // }
        // return user;
    }
}
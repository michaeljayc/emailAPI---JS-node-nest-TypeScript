import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            //get JWT from Header
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            
            // get JWT from cookie
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => (
                  request.cookies.jwt
                )
              ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }

    async validate(payload: any) {
        return {
            id: payload.id,
            email: payload.email,
            username: payload.username
        }
    }
}
import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthTokenService } from "./auth-token.service";

@Module({
    imports:[ JwtModule.register({
        secret: "secret",
        signOptions: {expiresIn: '1d'}
    }),],
    providers: [AuthTokenService],
    exports: [AuthTokenService]
})

export class AuthTokenModule {}
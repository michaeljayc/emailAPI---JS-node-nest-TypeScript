import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { AuthModule } from "src/auth/auth.module";
import AuthService from "src/auth/auth.service";
import { jwtConstants } from "src/auth/constants";
import LoggerService from "src/services/logger.service";
import { UserService } from "src/users/user.service";
import MessageController from "./message.controller";
import MessageService from "./message.service";

@Module({
    imports: [RethinkModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '1d'}
        }),
        AuthModule],
    controllers: [MessageController],
    providers: [MessageService,
        RethinkProvider,
        LoggerService,
        UserService,
        AuthService],
})

export class MessageModule {}   
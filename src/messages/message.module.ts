import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import LoggerService from "src/Services/logger.service";
import { UserService } from "src/users/user.service";
import MessageController from "./message.controller";
import MessageService from "./message.service";

@Module({
    imports: [RethinkModule,
    JwtModule.register({
        secret: "secret",
        signOptions: {expiresIn: '1d'}
    })],
    controllers: [MessageController],
    providers: [MessageService,
        RethinkProvider,
        LoggerService,
        UserService],
})

export class MessageModule {}   
import { RethinkModule } from "rethinkdb/rethink.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Logger, Module } from "@nestjs/common";
import RethinkProvider from "rethinkdb/database.provider";
import { UserRoleModule } from "src/user_roles/user_role.module";
import LoggerService from "src/Services/logger.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [RethinkModule, 
        UserRoleModule,
        JwtModule.register({
            secret: "secret",
            signOptions: {expiresIn: '1d'}
        })],
    controllers: [UserController],
    providers: [RethinkProvider, UserService, LoggerService],
    exports: [UserService]
})

export class UserModule {}
import { RethinkModule } from "rethinkdb/rethink.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Logger, Module } from "@nestjs/common";
import RethinkProvider from "rethinkdb/database.provider";
import { UserRoleModule } from "src/user_roles/user_role.module";
import LoggerService from "src/Services/logger.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service"
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/auth/roles.guard";
@Module({
    imports: [RethinkModule, 
        UserRoleModule,
        JwtModule.register({
            secret: "secret",
            signOptions: {expiresIn: '1d'}
        }),
    AuthModule],
    controllers: [UserController],
    providers: [RethinkProvider,
        UserService,
        LoggerService,
        AuthService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        },],
    exports: [UserService]
})

export class UserModule {}
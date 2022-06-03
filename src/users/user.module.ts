import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Module } from "@nestjs/common";
import { UserRoleModule } from "src/user_roles/user_role.module";
import LoggerService from "src/services/logger.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service"
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/guards/roles/roles.guard";
import { PassportModule } from "@nestjs/passport";
import { AuthTokenModule } from "src/guards/auth-token/auth-token.module";
import { RolesModule } from "src/guards/roles/roles.module";
import { PaginationModule } from "src/common/pagination/pagination.module";
import { DatabaseModule } from "src/database/database.module";
import { SearchModule } from "src/common/search/search.module";
@Module({
    imports: [DatabaseModule,
        PassportModule, 
        UserRoleModule,
        JwtModule.register({
            secret: "secret",
            signOptions: {expiresIn: '1d'}
        }),
        AuthModule,
        AuthTokenModule,
        RolesModule,
        PaginationModule,
        SearchModule],
    controllers: [UserController],
    providers: [UserService,
        LoggerService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }],
    exports: [UserService]
})

export class UserModule {}
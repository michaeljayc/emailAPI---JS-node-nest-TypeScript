import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule, PassportStrategy } from "@nestjs/passport";
import { DatabaseModule } from "src/database/database.module";
import { UserModule } from "src/users/user.module";
import { UserService } from "src/users/user.service";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";

@Module({
    imports: [DatabaseModule,
        forwardRef( () => UserModule),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '1d'}
        }),
    ],
    providers: [AuthService,UserService],
    controllers: [],
    exports: [AuthService],
})

export class AuthModule {}
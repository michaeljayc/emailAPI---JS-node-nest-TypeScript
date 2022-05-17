import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule, PassportStrategy } from "@nestjs/passport";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { UserModule } from "src/users/user.module";
import { UserService } from "src/users/user.service";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [RethinkModule,forwardRef( () => UserModule),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '1d'}
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy,UserService,RethinkProvider],
    controllers: [],
    exports: [AuthService],
})

export class AuthModule {}
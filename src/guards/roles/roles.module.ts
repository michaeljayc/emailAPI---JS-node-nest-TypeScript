import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/users/user.module";
import { RolesGuard } from "./roles.guard";
import { RolesService } from "./roles.services";

@Module({
    imports: [ 
        JwtModule.register({
        secret: "secret",
        signOptions: {expiresIn: '1d'}
        }),
        forwardRef(() => UserModule),],
    providers: [RolesGuard,RolesService],
    exports: [RolesService],
})

export class RolesModule {}
import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "src/database/database.module";
import { UserModule } from "src/users/user.module";
import { RolesGuard } from "./roles.guard";
import { RolesService } from "./roles.services";

@Module({
    imports: [DatabaseModule, 
        JwtModule.register({
        secret: "secret",
        signOptions: {expiresIn: '1d'}
        })],
    providers: [RolesGuard,RolesService],
    exports: [RolesService],
})

export class RolesModule {}
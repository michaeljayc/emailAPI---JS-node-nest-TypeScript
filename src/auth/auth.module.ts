import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { RolesGuard } from "src/auth/roles.guard";
import { AuthService } from "./auth.service";

@Module({
    imports: [RethinkModule],
    providers: [RethinkProvider,
        AuthService],
})

export class AuthModule {}
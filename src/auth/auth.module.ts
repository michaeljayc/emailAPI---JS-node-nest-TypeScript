import { Module } from "@nestjs/common";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { AuthService } from "./auth.service";

@Module({
    imports: [RethinkModule],
    providers: [RethinkProvider,
        AuthService],
})

export class AuthModule {}
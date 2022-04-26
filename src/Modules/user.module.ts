import { RethinkModule } from "rethinkdb/rethink.module";
import { UserResolver } from "src/Resolvers/user.resolver";
import { UserService } from "src/Services/user.service";
import { Module } from "@nestjs/common";
import RethinkProvider from "rethinkdb/database.provider";
import { UserRoleModule } from "./user_role.module";

@Module({
    imports: [RethinkModule, UserRoleModule],
    controllers: [UserResolver],
    providers: [UserService, RethinkProvider]
})

export class UserModule{}
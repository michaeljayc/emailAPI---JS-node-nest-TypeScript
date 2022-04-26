import { Module } from "@nestjs/common";
import { RethinkProvider } from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { UserRoleResolver } from "src/Resolvers/user_role.resolver";
import { UserRoleService } from "src/Services/user_role.service";

@Module({
    imports: [RethinkModule],
    controllers: [UserRoleResolver],
    providers: [UserRoleService, RethinkProvider]
})

export class UserRoleModule{}

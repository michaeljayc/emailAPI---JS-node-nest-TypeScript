import { Module } from "@nestjs/common";
import { RethinkProvider } from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { UserRoleController } from "./user_role.controller";
import { UserRoleService } from "./user_role.service";

@Module({
    imports: [RethinkModule],
    controllers: [UserRoleController],
    providers: [UserRoleService, RethinkProvider]
})

export class UserRoleModule{}

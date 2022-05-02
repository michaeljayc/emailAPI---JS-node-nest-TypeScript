import { Module } from "@nestjs/common";
import { RethinkProvider } from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { UserModule } from "src/users/user.module";
import { UserService } from "src/users/user.service";
import { UserRoleController } from "./user_role.controller";
import { UserRoleService } from "./user_role.service";

@Module({
    imports: [RethinkModule],
    controllers: [UserRoleController],
    providers: [UserRoleService, RethinkProvider, UserService]
})

export class UserRoleModule{}

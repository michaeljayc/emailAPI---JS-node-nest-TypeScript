import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { RolesModule } from "src/guards/roles/roles.module";
import { UserService } from "src/users/user.service";
import { UserRoleController } from "./user_role.controller";
import { UserRoleService } from "./user_role.service";

@Module({
    imports: [DatabaseModule, RolesModule],
    controllers: [UserRoleController],
    providers: [UserRoleService, UserService]
})

export class UserRoleModule{}
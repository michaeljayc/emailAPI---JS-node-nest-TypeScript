import { Injectable, Inject } from "@nestjs/common";
import { UserRole } from "src/user_roles/user_role.entity";
import * as rethink from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";

const TABLE = "user_role";
const DB = "emailAPI";

@Injectable()
export class UserRoleService {

    constructor(private databaseService: DatabaseService){}

    async getUserRoleById(id: string): Promise<UserRole> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run()
    }

    async getUserRoles(): Promise<UserRole> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .orderBy('user_role_id')
            .run()
    }
}
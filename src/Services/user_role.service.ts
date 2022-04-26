import { Injectable, Inject } from "@nestjs/common";
import { UserRole } from "src/Entities/user_role.entity";
import * as rethink from "rethinkdb";

const TABLE = "user_role";
const DB = "emailAPI";

@Injectable()
export class UserRoleService {

    private connection: rethink.Connection;

    constructor(@Inject('RethinkProvider') connection){
        this.connection = connection;
    }

    async getUserRoleById(id: string): Promise<UserRole> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection)
    }

    async getUserRoles(): Promise<UserRole> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .orderBy('user_role_id')
            .run(this.connection)
    }
}
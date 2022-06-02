import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { User } from "./user.entity";
import * as rethink from "rethinkdbdash";
import { PaginationService } from "src/common/pagination/pagination.service";
import { DatabaseService } from "src/database/database.service";

require('dotenv').config()
const {DB} = process.env;
const TABLE = "users";

@Injectable()
export class UserService {

    constructor(private databaseService: DatabaseService){}

    async createNewUser(user: User): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .insert(
                user,
                {returnChanges: "always"}
            )
            .run()
    }

    async getAllUsers(): Promise<rethink.WriteResult>{
        return this.databaseService.list(DB, TABLE);
    }

    async getUserById(id: string): Promise<User> {
        return this.databaseService.getById(DB, TABLE, id);
    }

    async getUserByEmail(email:string): Promise<any> {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter({
                'email': email
            })
            .run()
    }

    async updateUser(user: User, user_id:string)
        : Promise<rethink.WriteResult> {
            return rethink
                .db(DB)
                .table(TABLE)
                .get(user_id)
                .update(
                    user,
                    {returnChanges: "always"}
                )
                .run()
    }

    async deleteUser(id: string): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .delete({returnChanges: "always"})
            .run()
    }

}
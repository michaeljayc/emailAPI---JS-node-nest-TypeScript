import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { User } from "./user.entity";
import * as rethink from "rethinkdb";
import { PaginationService } from "src/common/pagination/pagination.service";

require('dotenv').config()
const {DB} = process.env;
const TABLE = "users";

@Injectable()
export class UserService {
    
    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection){
        this.connection = connection;
    }

    async createNewUser(user: User): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .insert(
                user,
                {returnChanges: "always"}
            )
            .run(this.connection)
    }

    async getAllUsers(): Promise<User>{
        return rethink
            .db(DB)
            .table(TABLE)
            .orderBy('updated_date')
            .run(this.connection)
    }

    async getUserById(id: string): Promise<User> {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection)
    }

    async getUserByEmail(email:string): Promise<any> {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter({
                'email': email
            })
            .run(this.connection)
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
                .run(this.connection)
    }

    async deleteUser(id: string): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .delete({returnChanges: "always"})
            .run(this.connection)
    }

}
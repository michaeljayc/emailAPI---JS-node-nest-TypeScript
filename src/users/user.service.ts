import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { User } from "./user.entity";
import * as rethink from "rethinkdb";
import * as common from "src/common/common";

const TABLE = "users";
const DB = "emailAPI";

@Injectable()
export class UserService {
    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection){
        this.connection = connection;
    }

    async registerUser(user: User): Promise<rethink.WriteResult> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .insert(user)
            .run(this.connection)
    }

    async loginUser(id: string): Promise<User>{
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection)
    }

    async getAllUsers(): Promise<User> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .orderBy('updated_date')
            .run(this.connection)
    }

    async getUserById(id: string): Promise<User> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection)
    }

    async getUserByUsername(username:string): Promise<any> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .filter(
                { "username": username}
            )
            .run(this.connection)
    }

    async getUserByEmail(credentials: common.loginCredentials): Promise<any> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .filter({
                'email': credentials.email
            })
            .run(this.connection)
    }

    async updateUser(user: User): Promise<rethink.WriteResult> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(user.id)
            .update(user)
            .run(this.connection)
    }

    async deleteUser(id: string): Promise<rethink.WriteResult> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .delete()
            .run(this.connection)
    }

}
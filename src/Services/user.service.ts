import { Injectable, Inject } from "@nestjs/common";
import { User } from "../Entities/user.entity";
import * as rethink from "rethinkdb";
import * as common from "src/common/common";
import { catchError } from "rxjs";

const TABLE = "users";
const DB = "emailAPI";

@Injectable()
export class UserService {
    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection){
        this.connection = connection;
    }

    async getAllUsers(): Promise<User> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .orderBy('join_date')
            .run(this.connection)
    }

    async getUserByEmail(credentials: common.LoginCredentials): Promise<any> {
        
        let data =  await rethink
        .db(DB)
        .table(TABLE)
        .filter({
            'email': credentials.email
        })
        .run(this.connection)
        
        return data;
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
}
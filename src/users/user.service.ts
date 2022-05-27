import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { User } from "./user.entity";
import * as rethink from "rethinkdb";
import { PaginationService } from "src/common/pagination/pagination.service";

const TABLE = "users";
const DB = "emailAPI";

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
            .insert(user)
            .run(this.connection)
    }

    async getAllUsers(): Promise<User>{
        return rethink
            .db(DB)
            .table(TABLE)
            .orderBy('updated_date')
            .run(this.connection)
    }

    async getUserById(uuid: string): Promise<User> {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(uuid)
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
            await rethink
                .db(DB)
                .table(TABLE)
                .get(user_id)
                .update(user)
                .run(this.connection)
            
            return await this.getUserById(user_id);
    }

    async deleteUser(id: string): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .delete()
            .run(this.connection)
    }

}
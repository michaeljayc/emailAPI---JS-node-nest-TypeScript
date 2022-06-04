import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { User } from "./user.entity";
import * as rethink from "rethinkdbdash";
import { PaginationService } from "src/common/pagination/pagination.service";
import { DatabaseService } from "src/database/database.service";

require('dotenv').config()
//const {DB} = process.env;
const DB = "emailAPI"
const TABLE = "users";

@Injectable()
export class UserService {

    constructor(private databaseService: DatabaseService){}

    async createNewUser(user: User): Promise<rethink.WriteResult> {
        return this.databaseService.insertRecord(DB, TABLE, user);
    }

    async getAllUsers(): Promise<rethink.WriteResult>{
        return this.databaseService.list(DB, TABLE);
    }

    async getUserById(id: string): Promise<User> {
        return this.databaseService.getById(DB, TABLE, id);
    }

    async getUserByEmail(email:string): Promise<any> {
        return this.databaseService.getByFilter(DB, TABLE, {email: email})
    }

    async updateUser(user: User, user_id:string)
        : Promise<rethink.WriteResult> {
            return this.databaseService.updateRecord(DB, TABLE, user_id, user);
    }

    async deleteUser(id: string): Promise<rethink.WriteResult> {
       return this.databaseService.deleteRecord(DB, TABLE, id);
    }

}
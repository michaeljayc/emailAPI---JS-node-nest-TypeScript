import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "src/database/database.service";
import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";

require('dotenv').config()
const {DB}:Record<string,any> = process.env;
const TABLE = "users";
@Injectable()
export class RolesService {

    constructor(private databaseService: DatabaseService){}

    async getUserDataContext(data: any): Promise<User | null> {
        let user = await this
          .databaseService.getByFilter(DB, TABLE, {email: data.email})

        if (user.length !== 0) 
          return user[0];
          
        return null
    }
    
}
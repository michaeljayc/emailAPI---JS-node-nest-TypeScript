import { Inject, Injectable } from "@nestjs/common";
import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";
const bcrypt = require('bcrypt');
import * as rethink from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";
import { createDecipheriv } from "crypto";

const TABLE = "users";
const DB: string = "emailAPI";
@Injectable()
export class AuthService {

    constructor(private databaseService: DatabaseService) {}

    async register(user: User): Promise<rethink.WriteResult> {
        return this.databaseService.insertRecord(DB, TABLE, user);
    }

    async login(login_email: string): Promise<User>{
        return this.databaseService.getByFilter(DB, TABLE, {email:login_email})
    }

    async ecnryptPassword(password: any): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(password, salt);
        return hashed_password;
    }

    async comparePassword(newPassword: string, passwordHash: string): Promise<any>{
        return await bcrypt.compare(newPassword,passwordHash)
    }
}

export default AuthService;


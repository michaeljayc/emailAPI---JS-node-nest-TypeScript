import { Inject, Injectable } from "@nestjs/common";
import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";
const bcrypt = require('bcrypt');
import * as rethink from "rethinkdb";

const TABLE = "users";
const DB: string = "emailAPI";
@Injectable()
export class AuthService {

    private connection: rethink.Connection;
    
    constructor(private userService: UserService,
        @Inject("RethinkProvider") connection) {
            this.connection = connection;
        }

    async register(user: User): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .insert(user)
            .run(this.connection)
    }

    async login(login_email: string): Promise<User>{
        return rethink
            .db(DB)
            .table(TABLE)
            .filter({
                email: login_email
            })
            .run(this.connection)
    }

    async ecnryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(password, salt);
        return hashed_password;
    }

    async comparePassword(newPassword: string, passwordHash: string): Promise<any>{
        return await bcrypt.compare(newPassword,passwordHash)
    }
}

export default AuthService;


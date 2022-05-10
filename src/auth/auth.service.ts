import { Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdb";
import * as common from "src/common/common";
const bcrypt = require('bcrypt');

const TABLE = "users";
const DB: string = "emailAPI";
@Injectable()
export class AuthService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection){
        this.connection = connection;
    }

    async getUserData(credentials: common.loginCredentials): Promise<any> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .filter({
                'email':credentials.email
            })
            .run(this.connection)
    }

    async ecnryptPassword(password: string): Promise<string> {
        // Encrypt Password
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(password, salt);
        return hashed_password;
    }

    async comparePassword(newPassword: string, passwordHash: string): Promise<any>{
        return await bcrypt.compare(newPassword,passwordHash)
    }
}


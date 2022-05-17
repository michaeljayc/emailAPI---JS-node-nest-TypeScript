import { Injectable } from "@nestjs/common";
import User from "src/users/user.entity";
import { UserService } from "src/users/user.service";
const bcrypt = require('bcrypt');

const TABLE = "users";
const DB: string = "emailAPI";
@Injectable()
export class AuthService {

    constructor(private userService: UserService){}

    async validateUser(credentials): Promise<any> {
        console.log(credentials)
        const user = await this.userService.getUserByEmail(credentials.email);
        const valid_password = this
            .comparePassword(credentials.email, credentials.password)
        if (user && valid_password) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user:User): Promise<any> {
        console.log(user)
        // const jwt = {
        //     id: user.id,
        //     username: user.username,
        //     email: user.email
        // };

        // return {
        //     access_token: this.jwtService.signAsync(jwt),
        // };
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

export default AuthService;


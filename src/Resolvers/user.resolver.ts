import { Body, Controller, Get, Param, Post, ValidationPipe } from "@nestjs/common";
import { UserRole } from "src/Entities/user_role.entity";
import { UserService } from "src/Services/user.service";
import { User } from "../Entities/user.entity";
import * as common from "src/common/common";
import * as bcrypt from "bcrypt";
import * as error from "src/common/errors";
import * as UserDecorator from "../decorators/user.decorator";

@Controller("api")
export class UserResolver {

    constructor(private userService: UserService){}

    @Get("users")
    async getAllUsers(): Promise<User> {
        let response = await this.userService.getAllUsers()
            .then( result => {
                return result;
            })
            .catch( error => {
                throw new error;
            })
        
        return response;
    }

    @Post("users/add")
    async registerUser(@Body() user:User): Promise<string> {
        user.created_date = common.setDateTime();
        user.updated_date = common.setDateTime();

        // Encrypt Password
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;

        let response = await this.userService.registerUser(user)
            .then( result => {
                return result;
            });
        
        return response;
    }

    @Get("login")
    async loginUser(@Body() credentials:common.LoginCredentials): Promise<common.ResponseFormat> {
        
        let user_data: any = await this.userService.getUserByEmail(credentials);
 
        if (Object.keys(user_data._responses).length !== 0) {
            user_data = user_data.next()._settledValue;
            if (await bcrypt.compare(credentials.password, user_data.password)) {
                let response = await this.userService.loginUser(user_data.id)
                    .then( result => {
                        return common.formatResponse(result)
                    })
                    .catch( error => {return error})

                return response;
            } else {
                return error.incorrectUserPassword();
            }
        }       
        else {
             return error.userEmailDoesNotExist(credentials.email);
        }
    }

}
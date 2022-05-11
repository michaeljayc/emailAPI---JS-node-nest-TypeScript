import { 
    Body,
    Controller, 
    Delete, 
    ForbiddenException, 
    Get, 
    Logger, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req, 
    Res 
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoggerService } from "src/Services/logger.service";
import { AuthService } from "src/auth/auth.service";
import { User } from "./user.entity";
import * as common from "src/common/common";
import * as error from "src/common/errors";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { Role } from "src/user_roles/role.enum";
import { Roles } from "src/user_roles/role.decorator";

const DATE = new Date;

@Controller()
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService,
        private loggerService: LoggerService,
        private authService: AuthService,
        private jwtService: JwtService){}

    @Post("register")
    async registerUser(@Body() user:User)
        : Promise<common.ResponseFormat |  any> {
        
        if (user) 
            return {
                success: false,
                message: "Fields are empty"
            }

        // Set create  and update datetime
        user.created_date = common.setDateTime();
        user.updated_date = common.setDateTime();
        
        // Encrypt Password
        user.password = await 
            this
            .authService
            .ecnryptPassword(user.password);
        
        let response = await this.userService.registerUser(user)
            .then( result => {
                return result;
            })
            .catch( error => { return error });
        
        if (response.inserted === 1) {
            response = common
                .formatResponse(
                    [user],true, "Registration Successful"
                );
        }

        this
        .loggerService
        .insertLogs(common
            .formatLogs(
                "registerUser", user, response
                )
        );

        return response;
    }

    @Post("login")
    async loginUser(
        @Body() credentials: common.loginCredentials,
        @Res({passthrough: true}) response: Response)
        : Promise<common.ResponseFormat | any> {
        
            if (credentials)
                return {
                    success: false,
                    message: "Fields are empty"
                }

            let user_data: any;
            let response_data: any = await 
                this
                .userService
                .getUserByEmail(credentials.email);
            if (Object.keys(response_data._responses).length === 0) {
                return response_data = error
                    .userEmailDoesNotExist(credentials.email);
            }

            user_data = response_data.next()._settledValue;
            if (! await this.authService.comparePassword(
                credentials.password, 
                user_data.password)) {

                    return response_data = error.incorrectUserPassword();
            }

            // Data store in the cookie
            const jwt = await this.jwtService.signAsync(
                {
                    id: user_data.id, 
                    username: user_data.username,
                    email: user_data.email
                }
            )

            response_data = common
                .formatResponse(
                    [user_data], true, "Login Successful."
                );
            this
            .loggerService
            .insertLogs(common
                .formatLogs(
                    "loginUser", credentials, response_data
                )
            );

            response.cookie("jwt", jwt, {httpOnly: true});
            return response_data;
    }

    @Get("user")
    async getUser(@Req() request: Request)
        : Promise<common.ResponseFormat> {

            let {password, ...param} = request.body;
            let formatted_response: common.ResponseFormat;
            const cookie = request.cookies['jwt'];
            
            if (!cookie) 
                throw new ForbiddenException;

            const data = await this.jwtService.verifyAsync(cookie);
            const user_data = await 
                this.userService.getUserById(data.id);
            formatted_response = common
                .formatResponse([user_data],true, "Success");

            this
            .loggerService
            .insertLogs(common
                .formatLogs(
                    "getUser", param, formatted_response
                )
            );

            return formatted_response;
    }

    @Get("users")
    @Roles(Role.Admin)
    async getAllUsers(): Promise<common.ResponseFormat> {
        let response: any = await this.userService.getAllUsers()
            .then( result => {
                return result
            })
  
        response = common
            .formatResponse(
                response,true,"Success"
            )
        
        this
        .loggerService
        .insertLogs(common
            .formatLogs(
                "getAllUsers", {}, response
            )
        );

        return response;
    }

    @Get("edit/:username")
    @Roles(Role.Admin)
    async editUser(@Req() request:Request,
        @Param() param): Promise<common.ResponseFormat> {
        
        const username = param.username;
        let response: common.ResponseFormat;

        //Get cookie - 'username' and compare with parameter
        let data = await 
            this
            .jwtService
            .verifyAsync(request.cookies['jwt'])
        
        if (data.username === username) {
            let user_data = await 
                this
                .userService
                .getUserByUsername(username);
        
            if (Object.keys(user_data._responses).length >  0) {
                user_data = user_data.next()._settledValue;
                response = common
                    .formatResponse(
                        [user_data], true, "Success"
                    );
            } 
            else {
                response = common.formatResponse([]);
            }
        } else {
            throw new ForbiddenException;
        }
      
    
        this
        .loggerService
        .insertLogs(common
            .formatLogs(
                "editUser", param, response
            )
        );

        return response;
    }

    @Put("update")
    @Roles(Role.Admin)
    async updateUser(@Body() user: User,
        @Req() request: Request): Promise<common.ResponseFormat> {

            let formatted_response: common.ResponseFormat;
            user.updated_date = common.setDateTime();

            let response = await this.userService.updateUser(user);
            if (response.replaced !== 1)
                formatted_response = common
                    .formatResponse(
                        [user], false, "Failed"
                    );
            else
                formatted_response = common
                    .formatResponse(
                        [user], true, "Update Successful."
                    )

            this
            .loggerService
            .insertLogs(common
                .formatLogs(
                    "updateUser",user, formatted_response
                )
            )

            return formatted_response;
    }

    @Delete("delete")
    @Roles(Role.Admin)
    async deleteUser(@Query() query): Promise<common.ResponseFormat> {
            
            let formatted_response: common.ResponseFormat;
            let response = await this.userService.getUserById(query.id)
                .then( result => {
                    return common
                        .formatResponse(
                            [result], true, "Deleted successfully"
                        )
                })
                .catch( error => {
                    return common
                        .formatResponse(
                            [error], false, "User does not exist."
                        );
                })

            this
            .loggerService
            .insertLogs(common
                .formatLogs(
                    "deleteUser", query, response
                )
            )

            return response;
    }

    @Post("logout")
    async logoutUser(@Res({passthrough: true}) response: Response) {
        response.clearCookie("jwt");
        return common.formatResponse([],true, "Logout successful.");
    }

}
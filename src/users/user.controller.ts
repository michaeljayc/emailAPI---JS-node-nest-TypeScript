import { 
    BadRequestException,
    Body,
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    Logger, 
    NotFoundException, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req, 
    Res,
    UseGuards, 
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoggerService } from "src/services/logger.service";
import { AuthService } from "src/auth/auth.service";
import { User } from "./user.entity";
import { IResponseFormat } from "src/common/common.interface";
import { TLoginCredentials } from "./user.types";
import { 
    formatResponse, 
    formatLogs, 
    setDateTime, 
} from "src/common/common.functions";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { Role } from "src/user_roles/role.enum";
import { RoleGuard } from "src/user_roles/role.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AuthTokenGuard } from "src/guards/auth-token.guard";

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
        : Promise<IResponseFormat |  any> {
        
        let formatted_response: IResponseFormat;

        if (!Object.keys(user))
            throw new BadRequestException()

        try {
             // Set create  and update datetime
            user.created_date = setDateTime();
            user.updated_date = setDateTime();
            
            // Encrypt Password
            user.password = await 
                this
                .authService
                .ecnryptPassword(user.password);
            
            let response = await this.userService.registerUser(user)
            
            if (response.inserted === 1) {
                formatted_response = formatResponse(
                        [user],true, "Registration Successful"
                    );
            }

        } catch (error) {
            formatted_response = formatResponse(
                [error],false, "Registration Failed"
            )
            throw new Error(error);
        }

        this
        .loggerService
        .insertLogs(formatLogs(
                "registerUser", user , formatted_response
                )
            );

        return formatted_response;
    }

    @Post("login")
    async loginUser(
        @Body() credentials: TLoginCredentials,
        @Res({passthrough: true}) response: Response)
        : Promise<IResponseFormat | any> {

            let formatted_response: IResponseFormat;

            if (Object.keys(credentials).length < 1)
               throw new BadRequestException
                ("Input email and password", response.statusMessage);

            try {
                let user_data: any;
                let response_data: any = await 
                    this
                    .userService
                    .getUserByEmail(credentials.email);
                
                // If Username doesn't match any, throw NotFoundException
                if (Object.keys(response_data._responses).length === 0)
                    throw new NotFoundException
                        ("Email doesn't exist", response.statusMessage)
    
                user_data = response_data.next()._settledValue;
    
                // If Password doesn't match, throw NotFoundException
                if (! await this.authService.comparePassword(
                    credentials.password, user_data.password)) 
                        throw new NotFoundException
                            ("Incorrect password", response.statusMessage)
    
                // Data store in the cookie
                const jwt = await this.jwtService.signAsync(
                    {
                        id: user_data.id, 
                        username: user_data.username,
                        email: user_data.email
                    }
                )

                response.cookie("jwt", jwt, {httpOnly: true});
                formatted_response = formatResponse(
                    [user_data], true, "Login Successful."
                );
            } catch (error) {
                formatted_response = formatResponse(
                    [error], false, "Login Failed."
                );
            }

            this
            .loggerService
            .insertLogs(formatLogs(
                    "loginUser", credentials, formatted_response
                )
            );

            return formatted_response;
    }

    // http://localhost:3000/api/user
    //@UseGuards(JwtAuthGuard, AuthTokenGuard)
    @Get("user")
    async getUser(@Req() request: Request)
        : Promise<IResponseFormat> {

            let user_data: User;
            let formatted_response: IResponseFormat;
            
            try {
                const data = await 
                    this
                    .jwtService
                    .verifyAsync(request.cookies['jwt'])
                user_data = await this.userService.getUserById(data.id);
                formatted_response = formatResponse(
                    [user_data],true, "Success"
                );
            } catch (error) {
                 formatted_response = formatResponse(
                    [error],false, "Failed"
                );
                throw new HttpException(error, error.HttpCode)
            }
        
            this
            .loggerService
            .insertLogs(formatLogs(
                    "getUser", user_data, formatted_response
                )
            );

            return formatted_response;
    }

    // http://localhost:3000/api/users
    @UseGuards(JwtAuthGuard, AuthTokenGuard)
    @Get("users")
    @RoleGuard(Role.Admin)
    async getAllUsers(@Req() request: Request)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;        
            let response: User;

            try {

                response = await this.userService.getAllUsers()
                let res_length = Object.keys(response).length;
                formatted_response = formatResponse(
                        res_length > 1 ? response : [response],
                        true,
                        "Success"
                    )

            } catch(error) {
                formatted_response = formatResponse(
                    [error], false, "Failed"
                )
                throw new HttpException(error, error.HttpCode)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("getAllUsers", response, formatted_response)
            );

            return formatted_response;
    }

    // http://localhost:3000/api/edit/username
    @Get("edit/:username")
    @RoleGuard(Role.Admin)
    async editUser(@Req() request:Request,
        @Param() param): Promise<IResponseFormat> {
        
        const username = param.username;
        let formatted_response: IResponseFormat;
        
        try {
            let user_data = await 
                this
                .userService
                .getUserByUsername(username);

            if (Object.keys(user_data._responses).length >  0) {
                user_data = user_data.next()._settledValue;
                formatted_response = formatResponse(
                        [user_data], 
                        true, 
                        "Success."
                    );
            } else {
                throw new NotFoundException(username, "User doesn't exist.")
            }
        } catch (error) {
            formatted_response = formatResponse(
                [error],
                false,
                error.status
            )
        }
    
        this
        .loggerService
        .insertLogs(formatLogs(
                "editUser", param, formatted_response
            )
        );

        return formatted_response;
    }

    //http://localhost:3000/api/update/kmarcus20
    @Put("update/:username")
    @RoleGuard(Role.Admin)
    async updateUser(@Req() request: Request,
        @Body() user: User,
        @Param() param): Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;
            user.updated_date = setDateTime();

            try {
                let user_data = await 
                    this
                    .userService
                    .getUserByUsername(param.username)
                
                if (user_data._responses.length < 1)
                    throw new NotFoundException(
                        param.username, 
                        "User doesn't exist."
                    )
                
                user_data = user_data.next()._settledValue;
                let response = await 
                    this
                    .userService
                    .updateUser(user,user_data.id);
                
                formatted_response = formatResponse(
                    [user], true, "Update Successful."
                )
            } catch (error) {
                formatted_response = formatResponse(
                    [error],
                    false,
                    error.status
                )
            }

            this
            .loggerService
            .insertLogs(formatLogs(
                    "updateUser",user, formatted_response
                )
            )

            return formatted_response;
    }

    // http://localhost:3000/api/delete?id=123abc
    @Delete("delete")
    @RoleGuard(Role.Admin)
    async deleteUser(@Query() query): Promise<IResponseFormat> {
            
        let formatted_response: IResponseFormat;
        const id_to_delete = query.id;
        
        try {
            let user = await 
                this
                .userService
                .getUserById(id_to_delete)
            
            if (!user)
                throw new 
                    NotFoundException(
                        id_to_delete,
                        "ID doesn't exist"    
                    )
            
            let response = await 
                this
                .userService
                .deleteUser(id_to_delete)

            formatted_response = formatResponse(
                [response],
                true,
                "Successfully deleted user."
            )
        } catch (error) {
            formatted_response = formatResponse(
                [error],
                false,
                error.status
            )
        }

        this
        .loggerService
        .insertLogs(formatLogs(
                "deleteUser", query, formatted_response
            )
        )

        return formatted_response;
    }

    @Post("logout")
    async logoutUser(@Req() request:Request,
        @Res({passthrough: true}) response: Response)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;
            try {
                response.clearCookie("jwt");
                formatted_response = formatResponse(
                    [],
                    true,
                    "Logout successful."
                );
            } catch (error) {
                formatted_response = formatResponse(
                    [error],
                    false,
                    "Failed."
                );
            }

            return formatted_response;
    }

}
import { 
    BadRequestException,
    Body,
    Controller, 
    Delete, 
    ForbiddenException, 
    Get, 
    HttpException, 
    HttpStatus, 
    Logger, 
    NotFoundException, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req, 
    Res, 
    UseFilters, 
    UseInterceptors
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoggerService } from "src/Services/logger.service";
import { AuthService } from "src/auth/auth.service";
import { User } from "./user.entity";
import { IResponseFormat } from "src/common/common.interface";
import { TLoginCredentials } from "./user.types";
import { 
    formatResponse, 
    formatLogs, 
    setDateTime, 
    hidePasswordProperty
} from "src/common/common.functions";
import { 
    userEmailDoesNotExist, 
    incorrectUserPassword 
} from "./user.errors";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { Role } from "src/user_roles/role.enum";
import { RoleGuard } from "src/user_roles/role.decorator";

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
        
        if (Object.keys(user)) {
            throw new BadRequestException()
        }

        // Set create  and update datetime
        user.created_date = setDateTime();
        user.updated_date = setDateTime();
        
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
            response = formatResponse(
                    [user],true, "Registration Successful"
                );
        }

        this
        .loggerService
        .insertLogs(formatLogs(
                "registerUser", user, response
                )
            );

        return response;
    }

    @Post("login")
    async loginUser(
        @Body() credentials: TLoginCredentials,
        @Res({passthrough: true}) response: Response)
        : Promise<IResponseFormat | any> {

            if (Object.keys(credentials).length < 1)
               throw new BadRequestException();

            let user_data: any;
            let response_data: any = await 
                this
                .userService
                .getUserByEmail(credentials.email);
            
            // If Username doesn't match any, throw NotFoundException
            if (Object.keys(response_data._responses).length === 0)
                throw new NotFoundException()

            user_data = response_data.next()._settledValue;

            // If Password doesn't match, throw NotFoundException
            if (! await this.authService.comparePassword(
                credentials.password, 
                user_data.password)) 
                    throw new NotFoundException()

            // Data store in the cookie
            const jwt = await this.jwtService.signAsync(
                {
                    id: user_data.id, 
                    username: user_data.username,
                    email: user_data.email
                }
            )
            
            response_data = formatResponse(
                    [user_data], true, "Login Successful."
                );

            this
            .loggerService
            .insertLogs(formatLogs(
                    "loginUser", credentials, response_data
                )
            );

            response.cookie("jwt", jwt, {httpOnly: true});
            return response_data;
    }

    @Get("user")
    async getUser(@Req() request: Request)
        : Promise<IResponseFormat> {

            // let {password, ...param} = request.body;
            let formatted_response: IResponseFormat;
            const cookie = request.cookies['jwt'];
            
            if (!cookie) 
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)

            const data = await this.jwtService.verifyAsync(cookie);
            const {password, ...user_data} = await 
                this.userService.getUserById(data.id);
            formatted_response = formatResponse([user_data],true, "Success");

            this
            .loggerService
            .insertLogs(formatLogs(
                    "getUser", user_data, formatted_response
                )
            );

            return formatted_response;
    }

    @Get("users")
    @RoleGuard(Role.Admin)
    async getAllUsers(): Promise<IResponseFormat> {
        let response: any = await this.userService.getAllUsers()
            .then( result => {
                return result
            })
            
        response = formatResponse(
                response,true,"Success"
            )
        
        this
        .loggerService
        .insertLogs(formatLogs(
                "getAllUsers", {}, response
            )
        );

        return response;
    }

    @Get("edit/:username")
    @RoleGuard(Role.Admin)
    async editUser(@Req() request:Request,
        @Param() param): Promise<IResponseFormat> {
        
        const username = param.username;
        let response: IResponseFormat;

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
                response = formatResponse(
                        [user_data], true, "Success"
                    );
            } 
            else {
                response = formatResponse([]);
            }
        } else {
            throw new ForbiddenException;
        }
      
    
        this
        .loggerService
        .insertLogs(formatLogs(
                "editUser", param, response
            )
        );

        return response;
    }

    @Put("update")
    @RoleGuard(Role.Admin)
    async updateUser(@Body() user: User,
        @Req() request: Request): Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;
            user.updated_date = setDateTime();

            let response = await this.userService.updateUser(user);
            if (response.replaced !== 1)
                formatted_response = formatResponse(
                        [user], false, "Failed"
                    );
            else
                formatted_response = formatResponse(
                        [user], true, "Update Successful."
                    )

            this
            .loggerService
            .insertLogs(formatLogs(
                    "updateUser",user, formatted_response
                )
            )

            return formatted_response;
    }

    @Delete("delete")
    @RoleGuard(Role.Admin)
    async deleteUser(@Query() query): Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            let response = await this.userService.getUserById(query.id)
                .then( result => {
                    return formatResponse(
                            [result], true, "Deleted successfully"
                        )
                })
                .catch( error => {
                    return formatResponse(
                            [error], false, "User does not exist."
                        );
                })

            this
            .loggerService
            .insertLogs(formatLogs(
                    "deleteUser", query, response
                )
            )

            return response;
    }

    @Post("logout")
    async logoutUser(@Res({passthrough: true}) response: Response) {
        response.clearCookie("jwt");
        return formatResponse([],true, "Logout successful.");
    }

}
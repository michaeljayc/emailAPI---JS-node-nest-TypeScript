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
import { AuthTokenGuard } from "src/guards/auth-token/auth-token.guard";

const DATE = new Date;

@Controller("users")
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService,
        private loggerService: LoggerService,
        private authService: AuthService,
        private jwtService: JwtService){}

    
    
    // http://localhost:3000/api/users
    @RoleGuard(Role.Admin)
    @UseGuards(AuthTokenGuard)
    @Get("users")
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
        
    // http://localhost:3000/api/users/username
    @Get(":username")
    @UseGuards(AuthTokenGuard)
    async getUser(@Req() request: Request,
        @Param() param)
        : Promise<IResponseFormat> {
 
            let user: User;
            let formatted_response: IResponseFormat;
            
            try {
                const data = await this.userService.getUserByUsername(param.username);
                user = data.next()._settledValue;
                formatted_response = formatResponse(
                    [user],true, "Success"
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
                    "getUser", user, formatted_response
                )
            );

            return formatted_response;
    }

    // http://localhost:3000/api/users/edit/username
    @Get("edit/:username")
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    //@UseGuards(RoleGuard(Role.Admin))
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

    //http://localhost:3000/api/users/update/kmarcus20
    @Put("update/:username")
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    //@UseGuards(RoleGuard(Role.Admin))
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

    // http://localhost:3000/api/users/delete?id=123abc
    @Delete("delete")
    //@UseGuards(RoleGuard(Role.Admin))
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

}
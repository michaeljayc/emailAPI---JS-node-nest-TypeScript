import { 
    Body,
    Controller, 
    Delete, 
    Get, 
    HttpException, 
    NotFoundException, 
    Param, 
    Post, 
    Put, 
    Query, 
    Req,
    UseGuards, 
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LoggerService } from "src/services/logger.service";
import { IResponseFormat } from "src/common/common.interface";
import { 
    formatResponse, 
    formatLogs, 
    setDateTime, 
} from "src/common/common.functions";
import { Request } from "express";
import { Role } from "src/user_roles/role.enum";
import { RoleGuard } from "src/user_roles/role.decorator";
import { AuthTokenGuard } from "src/guards/auth-token/auth-token.guard";
import { UserDTO } from "./user.dto";
import AuthService from "src/auth/auth.service";
import { PaginationService } from "src/common/pagination/pagination.service";

const DATE = new Date;

@Controller("users")
export class UserController {

    constructor(private userService: UserService,
        private loggerService: LoggerService,
        private authService: AuthService,
        private paginationService: PaginationService){}

    // http://localhost:3000/api/users
    @RoleGuard(Role.Admin)
    @UseGuards(AuthTokenGuard)
    @Get("")
    async getAllUsers(@Req() request: Request,
        @Query() query)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;        
            let response: any;
            let page_number = (query.page !== undefined) ? 
                Number(query.page) : 1;
            
            try {
                // Retrieve and paginate data
                response = await this
                    .userService
                    .getAllUsers()
                        .then(result => {
                            
                            return this
                                .paginationService
                                .pagination(result,page_number)
                        })
                
                formatted_response = formatResponse
                (   
                    response.total_results > 1 ? response : [response],
                    true,
                    "Success"
                )
            } catch (error) {
                formatted_response = formatResponse(
                    [error], false, "Failed"
                )
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("getAllUsers", response, formatted_response)
            );

            return formatted_response;
    }
        
    // http://localhost:3000/api/users/id
    @UseGuards(AuthTokenGuard)
    @Get(":id")
    async getUserDetails(@Req() request: Request,
        @Param() param)
        : Promise<IResponseFormat> {
            
            let formatted_response: IResponseFormat;
            
            try {
                const response_data = await this
                    .userService
                    .getUserById(param.id);

                // check if id exists
                if (!response_data)
                    throw new NotFoundException
                        (`ID: [${param.id}] doesn't exist`)

                formatted_response = formatResponse
                    (response_data,true, "Success")
            } catch (error) {
                formatted_response = formatResponse
                    ([error],false, "Failed")
            }
        
            this
            .loggerService
            .insertLogs(formatLogs
                ("getUserDetails", param, formatted_response)
            );

            return formatted_response;
    }

    // http://localhost:3000/api/users/create
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    @Post("create")
    async create(@Body() user: UserDTO): Promise<IResponseFormat> {

        let formatted_response: IResponseFormat;
        const user_dto = new UserDTO();
        const default_user = ({
            ...user_dto,
            ...user
        })
        
        try {
            default_user.password = await this
                .authService.ecnryptPassword(default_user.password)

            await this.userService.createNewUser(default_user)
                .then( result => {
                    formatted_response = formatResponse
                        (   
                            result.changes[0].new_val, 
                            true, 
                            "User creation successful."
                        )
                })
        } catch (error) {
            formatted_response = formatResponse
                    ([error],false, "Failed")
            throw new HttpException(error, error.HttpCode)
        }

        this
        .loggerService
        .insertLogs(formatLogs("create", default_user, formatted_response))

        return formatted_response;
    }

    // http://localhost:3000/api/users/edit/id
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    @Get("edit/:id")
    async editUser(@Param() param): Promise<IResponseFormat> {
        
        let formatted_response: IResponseFormat;
        
        try {
            let response_data = await 
                this
                .userService
                .getUserById(param.id);
            
            if (!response_data)
                throw new NotFoundException
                    (param.uuid, `ID: [${param.id}] doesn't exist.`)
           
            formatted_response = formatResponse
                ([response_data], true, "Success.")

        } catch (error) {
            formatted_response = formatResponse
                ([error], false, error.status)
        }
    
        this
        .loggerService
        .insertLogs(formatLogs
            ("editUser", param, formatted_response)
        );

        return formatted_response;
    }

    // http://localhost:3000/api/users/update?id=123abc
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    @Put("update")
    async updateUser(@Body() user: UserDTO,
        @Query() query): Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;
            let default_user: UserDTO = user;

            try {
                // check if id exists
                let response= await 
                    this
                    .userService
                    .getUserById(query.id)

                if (!response)
                    throw new NotFoundException
                        (`ID: [${query.id}] doesn't exist.`)
               
                // update updated_date
                default_user.updated_date = setDateTime();
                
                formatted_response = await this
                    .userService
                    .updateUser(user,response.id)
                        .then( result => {
                            return formatResponse
                                (
                                    result.changes[0].new_val, 
                                    true, 
                                    "Success."
                                )
                        })
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.status)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("updateUser", user, formatted_response)
            )

            return formatted_response;
    }

    // http://localhost:3000/api/users/delete?id=123abc
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    @Delete("delete")
    async deleteUser(@Query() query): Promise<IResponseFormat> {

        let formatted_response: IResponseFormat;
        
        try {
            // check if user exists
            let user = await this
                .userService
                .getUserById(query.id)
            
            if (!user)
                throw new NotFoundException
                    ( `ID [${query.id}] doesn't exist`)
            
            formatted_response = await this
                .userService
                .deleteUser(query.id)
                    .then(result => {
                        return formatResponse
                        (
                            result.changes,
                            true,
                            "Successfully deleted user."
                        )
                    })
        } catch (error) {
            formatted_response = formatResponse
                ([error], false, error.status)
        }

        this
        .loggerService
        .insertLogs(formatLogs
            ("deleteUser", query, formatted_response)
        )

        return formatted_response;
    }

}
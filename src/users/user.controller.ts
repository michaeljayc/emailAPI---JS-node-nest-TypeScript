import { 
    BadRequestException,
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
import { User } from "./user.entity";
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
                (   response.total_results > 1 ? response : [response],
                    true,
                    "Success"
                )
            } catch (error) {
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
        
    // http://localhost:3000/api/users/uuid
    @UseGuards(AuthTokenGuard)
    @Get(":uuid")
    async getUserDetails(@Req() request: Request,
        @Param() param)
        : Promise<IResponseFormat> {
            
            let user: User;
            let formatted_response: IResponseFormat;
            
            try {
                const response_data = await this.userService.getUserById(param.uuid);
                if (!response_data)
                    throw new NotFoundException
                        (`UUID: [${param.uuid}] doesn't exist`)

                formatted_response = formatResponse
                    ([response_data],true, "Success")
            } catch (error) {
                formatted_response = formatResponse
                    ([error],false, "Failed")
                throw new HttpException(error, error.HttpCode)
            }
        
            this
            .loggerService
            .insertLogs(formatLogs
                ("getUserDetails", param, formatted_response)
            );

            return formatted_response;
    }

    // http://localhost:3000/api/users/new-user
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    @Post("new-user")
    async create(@Body() user: User): Promise<IResponseFormat> {

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
                        (default_user, true, "User creation successful.")
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

    // http://localhost:3000/api/users/edit/username
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    @Get("edit/:uuid")
    async editUser(@Req() request:Request,
        @Param() param): Promise<IResponseFormat> {
        
        let formatted_response: IResponseFormat;
        
        try {
            let response_data = await 
                this
                .userService
                .getUserById(param.uuid);
            
            if (!response_data)
                throw new NotFoundException
                    (param.uuid, `UUID: [${param.uuid}] doesn't exist.`)
           
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

    // http://localhost:3000/api/users/update?uuid=123abc
    @UseGuards(AuthTokenGuard)
    @RoleGuard(Role.Admin)
    @Put("update")
    async updateUser(@Body() user: User,
        @Query() query): Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;
            user.updated_date = setDateTime();

            try {
                let response_data = await 
                    this
                    .userService
                    .getUserById(query.uuid)

                if (!response_data)
                throw new NotFoundException
                    (query.uuid, `UUID: [${query.uuid}] doesn't exist.`)

                const a = await this
                    .userService
                    .updateUser(user,response_data.uuid);
                console.log(a)
               
                formatted_response = formatResponse
                    ([response_data], true, "Success.")
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
        const id_to_delete = query.id;
        
        try {
            let user = await 
                this
                .userService
                .getUserById(id_to_delete)
            
            if (!user)
                throw new BadRequestException
                    ( `ID: ${id_to_delete} doesn't exist`)
            
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
import { Controller, 
  Post, 
  Body, 
  BadRequestException, 
  Res, 
  NotFoundException, 
  Req
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import AuthService from './auth/auth.service';
import { formatLogs, formatResponse, setDateTime } from './common/common.functions';
import { IResponseFormat } from './common/common.interface';
import LoggerService from './services/logger.service';
import User from './users/user.entity';
import { Response, Request } from "express";
import { UserLoginDTO, UserDTO } from './users/user.dto';
import { DatabaseService } from './database/database.service';
import { initial_values } from './initializer';

@Controller()
export class AppController {

  constructor(private authService: AuthService,
    private loggerService: LoggerService,
    private jwtService: JwtService,
    private databaseService: DatabaseService){}

    async onModuleInit() {
        console.log("Initializing...");
        const databases = await this.databaseService.listDatabase();
        if (!databases.includes(initial_values.db)) {
            await this.databaseService
            .createDatabase(initial_values.db);
            console.log(`${initial_values.db} database created...`)
            await this.databaseService
                .createTable(initial_values.db,initial_values.tables);
            console.log(`${initial_values.tables} tables created...`)
            await this.databaseService
                .insertRecord(initial_values.db, 
                    initial_values.tables[(initial_values.tables.indexOf('user_roles'))], 
                    initial_values.roles);
            console.log(`Roles created...`)
            await this.databaseService
                .insertRecord(initial_values.db, 
                    initial_values.tables[(initial_values.tables.indexOf('users'))], 
                    initial_values.users.super_admin);
            console.log(`Super Admin created...`)
        }
        console.log("Ready...");
    }

    @Post("register")
    async registerUser(@Body() user: User)
        : Promise<IResponseFormat |  any> {
        
        let formatted_response: IResponseFormat = {
            success: false,
            message: "",
            count: 0
        }
        let user_register_dto = new UserDTO();
        const default_value = ({
            ...user_register_dto,
            ...user
        })

        try {
            // Encrypt Password
            default_value.password = await 
              this
              .authService
              .ecnryptPassword(default_value.password);
            
            await this
                .authService
                .register(default_value)
                    .then( result => {
                        formatted_response = formatResponse(
                            [default_value],true, "Registration Successful"
                        );
                    })

        } catch (error: any) {
            formatted_response = formatResponse(
                [error],false, "Registration Failed"
            )
            throw new Error(error);
        }

        this
        .loggerService
        .insertLogs(formatLogs(
                "registerUser", default_value , formatted_response
                )
            );

        return formatted_response;
    }

    @Post("login")
    async loginUser(@Req() request: Request,
      @Body() credentials: UserLoginDTO,
      @Res({passthrough: true}) response: Response)
      : Promise<IResponseFormat | any> {

        let formatted_response: IResponseFormat;
        if (Object.keys(credentials).length < 1)
            throw new BadRequestException
            ("Input email and password", response.statusMessage);

        try {
            if (request.cookies["jwt"])
                return formatResponse(null, true, 'You are currently logged in.' );
                
            let user_data: any;
            let response_data: any = await this
                .authService
                .login(credentials.email);
           
            // If Username doesn't match any, throw NotFoundException
            if (response_data.length === 0)
                throw new NotFoundException
                    (`User ${credentials.email} doesn't exist`)    
            
            user_data = response_data[0]

            // If Password doesn't match, throw NotFoundException
            if (! await this.authService.comparePassword(
                credentials.password, user_data.password)) 
                    throw new BadRequestException ("Incorrect password.")
            console.log(user_data)
            // Data store in the cookie
            const jwt = await this.jwtService.signAsync(
                {
                    id: user_data.id, 
                    username: user_data.username,
                    email: user_data.email,
                    role_type_id: user_data.role_type_id
                }
            )

            response.cookie("jwt", jwt, {httpOnly: true});
            formatted_response = formatResponse(
                [user_data], true, "Login Successful."
            );
        } catch (error) {
            console.log(error)
            formatted_response = formatResponse
                ([error], false, "Login Failed.");
        }

        this
        .loggerService
        .insertLogs(formatLogs(
                "loginUser", credentials, formatted_response
            )
        );

        return formatted_response;
    }

    @Post("logout")
    async logoutUser(@Req() request: Request,
        @Res({passthrough: true}) response: Response)
        : Promise<IResponseFormat> {

            let formatted_response: IResponseFormat;

            try {
                if (!request.cookies["jwt"])
                    formatted_response = formatResponse
                        (null, false, "You are currently logged out.")
                else {
                    response.clearCookie("jwt");
                    formatted_response = formatResponse
                        ([], true, "Logout successful.");
                }
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, "Failed.");
            }

            return formatted_response;
    }
}

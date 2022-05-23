import { Controller, 
  Get, 
  Post, 
  UseGuards, 
  Request, 
  Body, 
  BadRequestException, 
  Res, 
  NotFoundException, 
  Req
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import AuthService from './auth/auth.service';
import { formatLogs, formatResponse, setDateTime } from './common/common.functions';
import { IResponseFormat } from './common/common.interface';
import LoggerService from './services/logger.service';
import User from './users/user.entity';
import { UserService } from './users/user.service';
import { TLoginCredentials } from './users/user.types';
import { Response } from "express";

@Controller()
export class AppController {

  constructor(private authService: AuthService,
    private userService: UserService,
    private loggerService: LoggerService,
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

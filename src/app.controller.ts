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
import { formatLogs, formatResponse } from './common/common.functions';
import { IResponseFormat } from './common/common.interface';
import LoggerService from './services/logger.service';
import User from './users/user.entity';
import { Response } from "express";
import { UserLoginDTO, UserDTO } from './users/user.dto';

@Controller()
export class AppController {

  constructor(private authService: AuthService,
    private loggerService: LoggerService,
    private jwtService: JwtService){}


    @Post("register")
    async registerUser(@Body() user: User)
        : Promise<IResponseFormat |  any> {
        
        let formatted_response: IResponseFormat;
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

        } catch (error) {
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
    async loginUser(
      @Body() credentials: UserLoginDTO,
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
                .authService
                .login(credentials.email);
            
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
    async logoutUser(@Res({passthrough: true}) response: Response)
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

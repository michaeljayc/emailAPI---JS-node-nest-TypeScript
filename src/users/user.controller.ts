import { Body, Controller, forwardRef, Get, Inject, Logger, Param, Post, Req, Res, UnauthorizedException, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoggerService } from "src/Services/logger.service";
import { User } from "./user.entity";
import * as common from "src/common/common";
import * as bcrypt from "bcrypt";
import * as error from "src/common/errors";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { PassThrough } from "stream";

const DATE = new Date;

@Controller()
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService,
        private loggerService: LoggerService,
        private jwtService: JwtService){}

    @Get("users")
    async getAllUsers(): Promise<common.ResponseFormat> {
        let response = await this.userService.getAllUsers()
            .then( result => {
                return common.formatResponse(result)
            })
            .catch( error => {
                return common.formatResponse();
            })
        
        this.loggerService.insertLogs(common.formatLogs("getAllUsers", {}, response));
        return response;
    }

    @Post("register")
    async registerUser(@Body() user:User): Promise<common.ResponseFormat> {
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

        this.loggerService.insertLogs(common.formatLogs("registerUser", user, response));
        return response;
    }

    @Post("login")
    async loginUser(
        @Body() credentials: common.loginCredentials,
        @Res({passthrough: true}) response: Response): Promise<common.ResponseFormat> {

        let data: any;
        let response_data: any = await this.userService.getUserByEmail(credentials);
        if (Object.keys(response_data._responses).length === 0) {
            return response_data = error.userEmailDoesNotExist(credentials.email);
        }

        data = response_data.next()._settledValue;
        if (!await bcrypt.compare(credentials.password, data.password)) {
            return response_data = error.incorrectUserPassword();
        }

        const jwt = await this.jwtService.signAsync({id: data.id})
        response_data = await this.userService.loginUser(data.id)
            .then( result => {
                return common.formatResponse(result)
            })
            .catch( error => {return error})

        this.loggerService.insertLogs(common.formatLogs("loginUser", credentials, response_data));
        response.cookie("jwt", jwt, {httpOnly: true});
        return response_data;
    }

    @Get("user")
    async getUser(@Req() request: Request) {
        let formatted_response: common.ResponseFormat;
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            const {password, ...response} = await this.userService.getUserById(data.id);
            formatted_response = common.formatResponse(response);
        } catch(e) {
            throw new UnauthorizedException();
        }
        //this.loggerService.insertLogs(common.formatLogs("getUser", request, formatted_response));
        return formatted_response;
    }

}
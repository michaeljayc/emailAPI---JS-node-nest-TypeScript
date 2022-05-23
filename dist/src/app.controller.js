"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth/auth.service");
const common_functions_1 = require("./common/common.functions");
const logger_service_1 = require("./services/logger.service");
const user_entity_1 = require("./users/user.entity");
const user_service_1 = require("./users/user.service");
let AppController = class AppController {
    constructor(authService, userService, loggerService, jwtService) {
        this.authService = authService;
        this.userService = userService;
        this.loggerService = loggerService;
        this.jwtService = jwtService;
    }
    async registerUser(user) {
        let formatted_response;
        if (!Object.keys(user))
            throw new common_1.BadRequestException();
        try {
            user.created_date = (0, common_functions_1.setDateTime)();
            user.updated_date = (0, common_functions_1.setDateTime)();
            user.password = await this
                .authService
                .ecnryptPassword(user.password);
            let response = await this.userService.registerUser(user);
            if (response.inserted === 1) {
                formatted_response = (0, common_functions_1.formatResponse)([user], true, "Registration Successful");
            }
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Registration Failed");
            throw new Error(error);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("registerUser", user, formatted_response));
        return formatted_response;
    }
    async loginUser(credentials, response) {
        let formatted_response;
        if (Object.keys(credentials).length < 1)
            throw new common_1.BadRequestException("Input email and password", response.statusMessage);
        try {
            let user_data;
            let response_data = await this
                .userService
                .getUserByEmail(credentials.email);
            if (Object.keys(response_data._responses).length === 0)
                throw new common_1.NotFoundException("Email doesn't exist", response.statusMessage);
            user_data = response_data.next()._settledValue;
            if (!await this.authService.comparePassword(credentials.password, user_data.password))
                throw new common_1.NotFoundException("Incorrect password", response.statusMessage);
            const jwt = await this.jwtService.signAsync({
                id: user_data.id,
                username: user_data.username,
                email: user_data.email
            });
            response.cookie("jwt", jwt, { httpOnly: true });
            formatted_response = (0, common_functions_1.formatResponse)([user_data], true, "Login Successful.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Login Failed.");
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("loginUser", credentials, formatted_response));
        return formatted_response;
    }
    async logoutUser(request, response) {
        let formatted_response;
        try {
            response.clearCookie("jwt");
            formatted_response = (0, common_functions_1.formatResponse)([], true, "Logout successful.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed.");
        }
        return formatted_response;
    }
};
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.default]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "logoutUser", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.default,
        user_service_1.UserService,
        logger_service_1.default,
        jwt_1.JwtService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map
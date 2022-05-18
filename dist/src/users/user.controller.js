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
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const logger_service_1 = require("../services/logger.service");
const auth_service_1 = require("../auth/auth.service");
const user_entity_1 = require("./user.entity");
const common_functions_1 = require("../common/common.functions");
const jwt_1 = require("@nestjs/jwt");
const role_enum_1 = require("../user_roles/role.enum");
const role_decorator_1 = require("../user_roles/role.decorator");
const DATE = new Date;
let UserController = UserController_1 = class UserController {
    constructor(userService, loggerService, authService, jwtService) {
        this.userService = userService;
        this.loggerService = loggerService;
        this.authService = authService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(UserController_1.name);
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
    async getUser(request) {
        let user_data;
        let formatted_response;
        try {
            const data = await this
                .jwtService
                .verifyAsync(request.cookies['jwt']);
            user_data = await this.userService.getUserById(data.id);
            formatted_response = (0, common_functions_1.formatResponse)([user_data], true, "Success");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed");
            throw new common_1.HttpException(error, error.HttpCode);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("getUser", user_data, formatted_response));
        return formatted_response;
    }
    async getAllUsers(request) {
        let formatted_response;
        let response;
        try {
            response = await this.userService.getAllUsers();
            let res_length = Object.keys(response).length;
            formatted_response = (0, common_functions_1.formatResponse)(res_length > 1 ? response : [response], true, "Success");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed");
            throw new common_1.HttpException(error, error.HttpCode);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("getAllUsers", response, formatted_response));
        return formatted_response;
    }
    async editUser(request, param) {
        const username = param.username;
        let formatted_response;
        try {
            let user_data = await this
                .userService
                .getUserByUsername(username);
            if (Object.keys(user_data._responses).length > 0) {
                user_data = user_data.next()._settledValue;
                formatted_response = (0, common_functions_1.formatResponse)([user_data], true, "Success.");
            }
            else {
                throw new common_1.NotFoundException(username, "User doesn't exist.");
            }
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("editUser", param, formatted_response));
        return formatted_response;
    }
    async updateUser(request, user, param) {
        let formatted_response;
        user.updated_date = (0, common_functions_1.setDateTime)();
        try {
            let user_data = await this
                .userService
                .getUserByUsername(param.username);
            if (user_data._responses.length < 1)
                throw new common_1.NotFoundException(param.username, "User doesn't exist.");
            user_data = user_data.next()._settledValue;
            let response = await this
                .userService
                .updateUser(user, user_data.id);
            formatted_response = (0, common_functions_1.formatResponse)([user], true, "Update Successful.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("updateUser", user, formatted_response));
        return formatted_response;
    }
    async deleteUser(query) {
        let formatted_response;
        const id_to_delete = query.id;
        try {
            let user = await this
                .userService
                .getUserById(id_to_delete);
            if (!user)
                throw new common_1.NotFoundException(id_to_delete, "ID doesn't exist");
            let response = await this
                .userService
                .deleteUser(id_to_delete);
            formatted_response = (0, common_functions_1.formatResponse)([response], true, "Successfully deleted user.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("deleteUser", query, formatted_response));
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
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Get)("user"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)("users"),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("edit/:username"),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    (0, common_1.Put)("update/:username"),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("delete"),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logoutUser", null);
UserController = UserController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        logger_service_1.LoggerService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
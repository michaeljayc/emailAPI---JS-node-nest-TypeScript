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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const logger_service_1 = require("../services/logger.service");
const user_entity_1 = require("./user.entity");
const common_functions_1 = require("../common/common.functions");
const role_enum_1 = require("../user_roles/role.enum");
const role_decorator_1 = require("../user_roles/role.decorator");
const auth_token_guard_1 = require("../guards/auth-token/auth-token.guard");
const DATE = new Date;
let UserController = class UserController {
    constructor(userService, loggerService) {
        this.userService = userService;
        this.loggerService = loggerService;
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
    async getUser(request, param) {
        let user;
        let formatted_response;
        try {
            const data = await this.userService.getUserByUsername(param.username);
            if (data._responses.length < 1)
                throw new common_1.NotFoundException(`User '${param.username}' doesn't exist`);
            user = data.next()._settledValue;
            formatted_response = (0, common_functions_1.formatResponse)([user], true, "Success");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed");
            throw new common_1.HttpException(error, error.HttpCode);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("getUser", user, formatted_response));
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
                throw new common_1.BadRequestException(`ID: ${id_to_delete} doesn't exist`);
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
};
__decorate([
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Get)(":username"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    (0, common_1.Get)("edit/:username"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    (0, common_1.Put)("update/:username"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    (0, common_1.Delete)("delete"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        logger_service_1.LoggerService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
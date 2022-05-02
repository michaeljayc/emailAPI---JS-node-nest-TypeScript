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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const logger_service_1 = require("../Services/logger.service");
const auth_service_1 = require("../auth/auth.service");
const user_entity_1 = require("./user.entity");
const common = require("../common/common");
const error = require("../common/errors");
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
        user.created_date = common.setDateTime();
        user.updated_date = common.setDateTime();
        user.password = await this.authService.ecnryptPassword(user.password);
        let response = await this.userService.registerUser(user)
            .then(result => {
            return result;
        })
            .catch(error => { return error; });
        if (response.inserted === 1) {
            response = common.formatResponse([user], true, "Registration Successful");
        }
        this.loggerService.insertLogs(common.formatLogs("registerUser", user, response));
        return response;
    }
    async loginUser(credentials, response) {
        let user_data;
        let response_data = await this.userService.getUserByEmail(credentials);
        if (Object.keys(response_data._responses).length === 0) {
            return response_data = error.userEmailDoesNotExist(credentials.email);
        }
        user_data = response_data.next()._settledValue;
        if (!await this.authService.comparePassword(credentials.password, user_data.password)) {
            return response_data = error.incorrectUserPassword();
        }
        const jwt = await this.jwtService.signAsync({ id: user_data.id, username: user_data.username });
        response_data = common.formatResponse([user_data], true, "Login Successful.");
        this.loggerService.insertLogs(common.formatLogs("loginUser", credentials, response_data));
        response.cookie("jwt", jwt, { httpOnly: true });
        return response_data;
    }
    async getUser(request) {
        let _a = request.body, { password } = _a, param = __rest(_a, ["password"]);
        let formatted_response;
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        const user_data = await this.userService.getUserById(data.id);
        formatted_response = common.formatResponse([user_data], true, "Success");
        this.loggerService.insertLogs(common.formatLogs("getUser", param, formatted_response));
        return formatted_response;
    }
    async getAllUsers() {
        let response = await this.userService.getAllUsers()
            .then(result => {
            return result;
        });
        response = common.formatResponse(response, true, "Success");
        this.loggerService.insertLogs(common.formatLogs("getAllUsers", {}, response));
        return response;
    }
    async editUser(request, param) {
        const username = param.username;
        let response;
        let data = await this.jwtService.verifyAsync(request.cookies['jwt']);
        if (data.username === username) {
            let user_data = await this.userService.getUserByUsername(username);
            if (Object.keys(user_data._responses).length > 0) {
                user_data = user_data.next()._settledValue;
                response = common.formatResponse([user_data], true, "Success");
            }
            else {
                response = common.formatResponse([]);
            }
        }
        else {
            throw new common_1.ForbiddenException;
        }
        this.loggerService.insertLogs(common.formatLogs("editUser", param, response));
        return response;
    }
    async updateUser(id, user, request) {
        let formatted_response;
        user.updated_date = common.setDateTime();
        let response = await this.userService.updateUser(user);
        if (response.replaced !== 1)
            formatted_response = common.formatResponse([user], false, "Failed");
        else
            formatted_response = common.formatResponse([user], true, "Update Successful.");
        this.loggerService.insertLogs(common.formatLogs("updateUser", user, formatted_response));
        return formatted_response;
    }
    async deleteUser(param, request) {
        let formatted_response;
        let user_data = await this.userService.getUserById(param.id);
        if (!user_data) {
            formatted_response = common.formatResponse([], false, "User does not exist.");
        }
        else {
            let response = await this.userService.deleteUser(param.id);
            formatted_response = common.formatResponse([user_data], true, "Deleted successfully");
        }
        this.loggerService.insertLogs(common.formatLogs("deleteUser", param, formatted_response));
        return formatted_response;
    }
    async logoutUser(response) {
        response.clearCookie("jwt");
        return {
            "message": "success"
        };
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
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("edit/:username"),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, role_decorator_1.Roles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
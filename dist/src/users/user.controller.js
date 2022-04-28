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
const user_entity_1 = require("./user.entity");
const common = require("../common/common");
const bcrypt = require("bcrypt");
const error = require("../common/errors");
const jwt_1 = require("@nestjs/jwt");
const DATE = new Date;
let UserController = UserController_1 = class UserController {
    constructor(userService, loggerService, jwtService) {
        this.userService = userService;
        this.loggerService = loggerService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(UserController_1.name);
    }
    async getAllUsers() {
        let response = await this.userService.getAllUsers()
            .then(result => {
            return common.formatResponse(result);
        })
            .catch(error => {
            return common.formatResponse();
        });
        this.loggerService.insertLogs(common.formatLogs("getAllUsers", {}, response));
        return response;
    }
    async registerUser(user) {
        user.created_date = common.setDateTime();
        user.updated_date = common.setDateTime();
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        let response = await this.userService.registerUser(user)
            .then(result => {
            return result;
        });
        this.loggerService.insertLogs(common.formatLogs("registerUser", user, response));
        return response;
    }
    async loginUser(credentials, response) {
        let data;
        let response_data = await this.userService.getUserByEmail(credentials);
        if (Object.keys(response_data._responses).length === 0) {
            return response_data = error.userEmailDoesNotExist(credentials.email);
        }
        data = response_data.next()._settledValue;
        if (!await bcrypt.compare(credentials.password, data.password)) {
            return response_data = error.incorrectUserPassword();
        }
        const jwt = await this.jwtService.signAsync({ id: data.id });
        response_data = await this.userService.loginUser(data.id)
            .then(result => {
            return common.formatResponse(result);
        })
            .catch(error => { return error; });
        this.loggerService.insertLogs(common.formatLogs("loginUser", credentials, response_data));
        response.cookie("jwt", jwt, { httpOnly: true });
        return response_data;
    }
    async getUser(request) {
        let formatted_response;
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            const _a = await this.userService.getUserById(data.id), { password } = _a, response = __rest(_a, ["password"]);
            formatted_response = common.formatResponse(response);
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
        return formatted_response;
    }
};
__decorate([
    (0, common_1.Get)("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
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
UserController = UserController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        logger_service_1.LoggerService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
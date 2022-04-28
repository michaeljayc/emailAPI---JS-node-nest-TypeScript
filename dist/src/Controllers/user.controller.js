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
var UserController_1, _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("src/Services/user.service");
const logger_service_1 = require("../Services/logger.service");
const user_entity_1 = require("../Entities/user.entity");
const common = require("../common/common");
const bcrypt = require("bcrypt");
const error = require("../common/errors");
const DATE = new Date;
let UserController = UserController_1 = class UserController {
    constructor(userService, loggerService) {
        this.userService = userService;
        this.loggerService = loggerService;
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
    async loginUser(credentials) {
        let data;
        let response = await this.userService.getUserByEmail(credentials);
        if (Object.keys(response._responses).length !== 0) {
            data = response.next()._settledValue;
            let isMatch = await bcrypt.compare(credentials.password, data.password);
            if (isMatch) {
                response = await this.userService.loginUser(data.id)
                    .then(result => {
                    return common.formatResponse(result);
                })
                    .catch(error => { return error; });
            }
            else {
                response = error.incorrectUserPassword();
            }
        }
        else {
            response = error.userEmailDoesNotExist(credentials.email);
        }
        this.loggerService.insertLogs(common.formatLogs("loginUser", credentials, response));
        return response;
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
    __metadata("design:paramtypes", [typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
UserController = UserController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_b = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _b : Object, logger_service_1.LoggerService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
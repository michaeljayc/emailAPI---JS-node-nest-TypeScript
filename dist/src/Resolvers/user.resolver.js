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
exports.UserResolver = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../Services/user.service");
const user_entity_1 = require("../Entities/user.entity");
const common = require("../common/common");
const bcrypt = require("bcrypt");
const error = require("../common/errors");
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers() {
        let response = await this.userService.getAllUsers()
            .then(result => {
            return result;
        })
            .catch(error => {
            throw new error;
        });
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
        return response;
    }
    async loginUser(credentials) {
        let user_data = await this.userService.getUserByEmail(credentials);
        if (Object.keys(user_data._responses).length !== 0) {
            user_data = user_data.next()._settledValue;
            if (await bcrypt.compare(credentials.password, user_data.password)) {
                let response = await this.userService.loginUser(user_data.id)
                    .then(result => {
                    return common.formatResponse(result);
                })
                    .catch(error => { return error; });
                return response;
            }
            else {
                return error.incorrectUserPassword();
            }
        }
        else {
            return error.userEmailDoesNotExist(credentials.email);
        }
    }
};
__decorate([
    (0, common_1.Get)("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)("users/add"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registerUser", null);
__decorate([
    (0, common_1.Get)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "loginUser", null);
UserResolver = __decorate([
    (0, common_1.Controller)("api"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map
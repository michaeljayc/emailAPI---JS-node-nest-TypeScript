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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const common_functions_1 = require("../../common/common.functions");
const auth_token_service_1 = require("./auth-token.service");
let AuthTokenGuard = class AuthTokenGuard {
    constructor(authTokenService, jwtService) {
        this.authTokenService = authTokenService;
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        try {
            const req_data = context.getArgs()[1];
            return await this.authTokenService.getContextData(req_data.req.cookies.jwt);
        }
        catch (error) {
            console.log((0, common_functions_1.formatResponse)(null, false, error));
            throw new common_1.HttpException(error, error.statusCode);
        }
    }
};
AuthTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_token_service_1.AuthTokenService,
        jwt_1.JwtService])
], AuthTokenGuard);
exports.AuthTokenGuard = AuthTokenGuard;
//# sourceMappingURL=auth-token.guard.js.map
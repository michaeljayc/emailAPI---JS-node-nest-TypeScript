"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_token_service_1 = require("./auth-token.service");
let AuthTokenModule = class AuthTokenModule {
};
AuthTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({
                secret: "secret",
                signOptions: { expiresIn: '1d' }
            }),],
        providers: [auth_token_service_1.AuthTokenService],
        exports: [auth_token_service_1.AuthTokenService]
    })
], AuthTokenModule);
exports.AuthTokenModule = AuthTokenModule;
//# sourceMappingURL=auth-token.module.js.map
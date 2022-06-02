"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const user_module_1 = require("./users/user.module");
const user_role_module_1 = require("./user_roles/user_role.module");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const message_module_1 = require("./messages/message.module");
const core_1 = require("@nestjs/core");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const logger_service_1 = require("./services/logger.service");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            user_role_module_1.UserRoleModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            message_module_1.MessageModule,
            jwt_1.JwtModule.register({
                secret: "secret",
                signOptions: { expiresIn: '1d' }
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter
            },
            logger_service_1.default,
        ],
        exports: []
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
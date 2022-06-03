"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
const user_role_module_1 = require("../user_roles/user_role.module");
const logger_service_1 = __importDefault(require("../services/logger.service"));
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("../auth/auth.module");
const core_1 = require("@nestjs/core");
const roles_guard_1 = require("../guards/roles/roles.guard");
const passport_1 = require("@nestjs/passport");
const auth_token_module_1 = require("../guards/auth-token/auth-token.module");
const roles_module_1 = require("../guards/roles/roles.module");
const pagination_module_1 = require("../common/pagination/pagination.module");
const database_module_1 = require("../database/database.module");
const search_module_1 = require("../common/search/search.module");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule,
            passport_1.PassportModule,
            user_role_module_1.UserRoleModule,
            jwt_1.JwtModule.register({
                secret: "secret",
                signOptions: { expiresIn: '1d' }
            }),
            auth_module_1.AuthModule,
            auth_token_module_1.AuthTokenModule,
            roles_module_1.RolesModule,
            pagination_module_1.PaginationModule,
            search_module_1.SearchModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService,
            logger_service_1.default,
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard
            }],
        exports: [user_service_1.UserService]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map
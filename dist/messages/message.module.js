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
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const constants_1 = require("../auth/constants");
const pagination_module_1 = require("../common/pagination/pagination.module");
const search_module_1 = require("../common/search/search.module");
const database_module_1 = require("../database/database.module");
const auth_token_module_1 = require("../guards/auth-token/auth-token.module");
const logger_service_1 = __importDefault(require("../services/logger.service"));
const user_service_1 = require("../users/user.service");
const message_controller_1 = __importDefault(require("./message.controller"));
const message_service_1 = __importDefault(require("./message.service"));
let MessageModule = class MessageModule {
};
MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '1d' }
            }),
            auth_module_1.AuthModule,
            auth_token_module_1.AuthTokenModule,
            search_module_1.SearchModule,
            pagination_module_1.PaginationModule],
        controllers: [message_controller_1.default],
        providers: [message_service_1.default,
            logger_service_1.default,
            user_service_1.UserService,
            auth_service_1.default],
    })
], MessageModule);
exports.MessageModule = MessageModule;
//# sourceMappingURL=message.module.js.map
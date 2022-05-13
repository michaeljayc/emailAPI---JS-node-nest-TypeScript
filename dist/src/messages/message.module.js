"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_provider_1 = require("../../rethinkdb/database.provider");
const rethink_module_1 = require("../../rethinkdb/rethink.module");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
const logger_service_1 = require("../Services/logger.service");
const user_service_1 = require("../users/user.service");
const message_controller_1 = require("./message.controller");
const message_service_1 = require("./message.service");
let MessageModule = class MessageModule {
};
MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [rethink_module_1.RethinkModule,
            jwt_1.JwtModule.register({
                secret: "secret",
                signOptions: { expiresIn: '1d' }
            }),
            auth_module_1.AuthModule],
        controllers: [message_controller_1.default],
        providers: [message_service_1.default,
            database_provider_1.default,
            logger_service_1.default,
            user_service_1.UserService,
            auth_service_1.default],
    })
], MessageModule);
exports.MessageModule = MessageModule;
//# sourceMappingURL=message.module.js.map
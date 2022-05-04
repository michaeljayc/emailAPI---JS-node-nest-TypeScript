"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const rethink_module_1 = require("../../rethinkdb/rethink.module");
const user_controller_1 = require("src/Controllers/user.controller");
const user_service_1 = require("src/Services/user.service");
const common_1 = require("@nestjs/common");
const database_provider_1 = require("../../rethinkdb/database.provider");
const user_role_module_1 = require("./user_role.module");
const logger_service_1 = require("../Services/logger.service");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [rethink_module_1.RethinkModule, user_role_module_1.UserRoleModule],
        controllers: [user_controller_1.UserController],
        providers: [database_provider_1.default, user_service_1.UserService, logger_service_1.default],
        exports: [user_service_1.UserService]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map
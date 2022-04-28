"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleModule = void 0;
const common_1 = require("@nestjs/common");
const database_provider_1 = require("../../rethinkdb/database.provider");
const rethink_module_1 = require("../../rethinkdb/rethink.module");
const user_role_controller_1 = require("src/Controllers/user_role.controller");
const user_role_service_1 = require("../Services/user_role.service");
let UserRoleModule = class UserRoleModule {
};
UserRoleModule = __decorate([
    (0, common_1.Module)({
        imports: [rethink_module_1.RethinkModule],
        controllers: [user_role_controller_1.UserRoleController],
        providers: [user_role_service_1.UserRoleService, database_provider_1.RethinkProvider]
    })
], UserRoleModule);
exports.UserRoleModule = UserRoleModule;
//# sourceMappingURL=user_role.module.js.map
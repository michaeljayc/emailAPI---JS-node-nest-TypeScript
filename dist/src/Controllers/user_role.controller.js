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
exports.UserRoleController = void 0;
const common_1 = require("@nestjs/common");
const user_role_service_1 = require("../Services/user_role.service");
let UserRoleController = class UserRoleController {
    constructor(userRoleService) {
        this.userRoleService = userRoleService;
    }
    async getUserRoles() {
        let response = await this.userRoleService.getUserRoles()
            .then(result => {
            return result;
        })
            .catch(error => {
            return error;
        });
        return response;
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getUserRoles", null);
UserRoleController = __decorate([
    (0, common_1.Controller)("user-roles"),
    __metadata("design:paramtypes", [user_role_service_1.UserRoleService])
], UserRoleController);
exports.UserRoleController = UserRoleController;
//# sourceMappingURL=user_role.controller.js.map
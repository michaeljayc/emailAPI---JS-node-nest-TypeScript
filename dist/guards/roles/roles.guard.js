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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const role_decorator_1 = require("../../user_roles/role.decorator");
const jwt_1 = require("@nestjs/jwt");
const roles_services_1 = require("./roles.services");
let RolesGuard = class RolesGuard {
    constructor(reflector, rolesService, jwtService) {
        this.reflector = reflector;
        this.rolesService = rolesService;
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        try {
            const requiredRole = this
                .reflector
                .getAllAndOverride(role_decorator_1.ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRole) {
                return true;
            }
            const context_data = context.switchToHttp().getRequest();
            const data = await this.jwtService.verifyAsync(context_data.cookies.jwt);
            const user = await this.rolesService.getUserDataContext(data);
            if (requiredRole !== (user === null || user === void 0 ? void 0 : user.role_type_id))
                throw new common_1.UnauthorizedException();
            else
                return true;
        }
        catch (error) {
            throw new common_1.HttpException(error, error.statusCode);
        }
    }
};
RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        roles_services_1.RolesService,
        jwt_1.JwtService])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map
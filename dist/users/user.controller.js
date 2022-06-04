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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const logger_service_1 = require("../services/logger.service");
const common_functions_1 = require("../common/common.functions");
const role_enum_1 = require("../user_roles/role.enum");
const role_decorator_1 = require("../user_roles/role.decorator");
const auth_token_guard_1 = require("../guards/auth-token/auth-token.guard");
const user_dto_1 = require("./user.dto");
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const pagination_service_1 = require("../common/pagination/pagination.service");
const DATE = new Date;
let UserController = class UserController {
    constructor(userService, loggerService, authService, paginationService) {
        this.userService = userService;
        this.loggerService = loggerService;
        this.authService = authService;
        this.paginationService = paginationService;
    }
    async getAllUsers(request, query) {
        let formatted_response = {
            success: false,
            message: "",
            count: 0
        };
        let response;
        let page_number = (query.page !== undefined) ?
            Number(query.page) : 1;
        try {
            response = await this
                .userService
                .getAllUsers()
                .then(result => {
                return this
                    .paginationService
                    .pagination(result, page_number);
            });
            formatted_response = (0, common_functions_1.formatResponse)(response.total_results > 1 ? response : [response], true, "Success");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed");
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("getAllUsers", response, formatted_response));
        return formatted_response;
    }
    async getUserDetails(request, param) {
        let formatted_response;
        try {
            const response_data = await this
                .userService
                .getUserById(param.id);
            if (!response_data)
                throw new common_1.NotFoundException(`ID: [${param.id}] doesn't exist`);
            formatted_response = (0, common_functions_1.formatResponse)(response_data, true, "Success");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed");
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("getUserDetails", param, formatted_response));
        return formatted_response;
    }
    async create(user) {
        let formatted_response = {
            success: false,
            message: "",
            count: 0
        };
        const user_dto = new user_dto_1.UserDTO();
        const default_user = ({
            ...user_dto,
            ...user
        });
        try {
            default_user.password = await this
                .authService.ecnryptPassword(default_user.password);
            await this.userService.createNewUser(default_user)
                .then(result => {
                formatted_response = (0, common_functions_1.formatResponse)(result.changes[0].new_val, true, "User creation successful.");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, "Failed");
            throw new common_1.HttpException(error, error.HttpCode);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("create", default_user, formatted_response));
        return formatted_response;
    }
    async editUser(param) {
        let formatted_response;
        try {
            let response_data = await this
                .userService
                .getUserById(param.id);
            if (!response_data)
                throw new common_1.NotFoundException(param.uuid, `ID: [${param.id}] doesn't exist.`);
            formatted_response = (0, common_functions_1.formatResponse)([response_data], true, "Success.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("editUser", param, formatted_response));
        return formatted_response;
    }
    async updateUser(user, query) {
        let formatted_response;
        let default_user = user;
        try {
            let response = await this
                .userService
                .getUserById(query.id);
            if (!response)
                throw new common_1.NotFoundException(`ID: [${query.id}] doesn't exist.`);
            default_user.updated_date = (0, common_functions_1.setDateTime)();
            formatted_response = await this
                .userService
                .updateUser(user, response.id)
                .then(result => {
                return (0, common_functions_1.formatResponse)(result.changes[0].new_val, true, "Success.");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("updateUser", user, formatted_response));
        return formatted_response;
    }
    async deleteUser(query) {
        let formatted_response;
        try {
            let user = await this
                .userService
                .getUserById(query.id);
            if (!user)
                throw new common_1.NotFoundException(`ID [${query.id}] doesn't exist`);
            formatted_response = await this
                .userService
                .deleteUser(query.id)
                .then(result => {
                return (0, common_functions_1.formatResponse)(result.changes, true, "Successfully deleted user.");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("deleteUser", query, formatted_response));
        return formatted_response;
    }
};
__decorate([
    (0, role_decorator_1.RoleGuard)(role_enum_1.ROLE.Admin),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserDetails", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.ROLE.Admin),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.ROLE.Admin),
    (0, common_1.Get)("edit/:id"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.ROLE.Admin),
    (0, common_1.Put)("update"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.ROLE.Admin),
    (0, common_1.Delete)("delete"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        logger_service_1.LoggerService,
        auth_service_1.default,
        pagination_service_1.PaginationService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
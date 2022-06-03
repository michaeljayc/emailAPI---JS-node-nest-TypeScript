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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_token_guard_1 = require("../../guards/auth-token/auth-token.guard");
const role_decorator_1 = require("../../user_roles/role.decorator");
const role_enum_1 = require("../../user_roles/role.enum");
const search_service_1 = require("./search.service");
const pagination_service_1 = require("../pagination/pagination.service");
const common_functions_1 = require("../common.functions");
const logger_service_1 = __importDefault(require("../../services/logger.service"));
let SearchController = class SearchController {
    constructor(searchService, jwtService, paginationService, loggerService) {
        this.searchService = searchService;
        this.jwtService = jwtService;
        this.paginationService = paginationService;
        this.loggerService = loggerService;
    }
    async search(request, query) {
        var _a;
        const keyword = (_a = query.keyword) !== null && _a !== void 0 ? _a : "";
        let formatted_response;
        let page_number = (query.page !== undefined) ?
            Number(query.page) : 1;
        try {
            const cookie = await this
                .jwtService
                .verifyAsync(request.cookies["jwt"]);
            const response = await this
                .searchService
                .search("users", query.keyword, cookie.email)
                .then(result => {
                console.log(result);
                return this
                    .paginationService
                    .pagination(result, page_number);
            });
            formatted_response = (0, common_functions_1.formatResponse)((response) ? response : null, true, "Success");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.statusMessage);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("search", query, formatted_response));
        return formatted_response;
        return;
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, role_decorator_1.RoleGuard)(role_enum_1.Role.Admin),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
SearchController = __decorate([
    (0, common_1.Controller)("search"),
    __metadata("design:paramtypes", [search_service_1.SearchService,
        jwt_1.JwtService,
        pagination_service_1.PaginationService,
        logger_service_1.default])
], SearchController);
exports.SearchController = SearchController;
exports.default = SearchController;
//# sourceMappingURL=search.controller.js.map
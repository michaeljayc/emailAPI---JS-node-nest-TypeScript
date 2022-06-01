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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const common_1 = require("@nestjs/common");
let PaginationService = class PaginationService {
    constructor(connection) {
        this.connection = connection;
    }
    async pagination(data, page) {
        const per_page = 5;
        const total_results = Object.keys(data).length;
        const current = page;
        const total_pages = Math.ceil(total_results / per_page);
        const trim_start = (page - 1) * per_page;
        const trim_end = trim_start + per_page;
        const page_lists = data.slice(trim_start, trim_end);
        const paginated_data = {
            page_lists: page_lists,
            total_pages: total_pages,
            current_page: current,
            previous_page: current !== 1 ? current - 1 : 0,
            next_page: current !== total_pages ? current + 1 : 0,
            per_page: per_page,
            total_results: total_results,
        };
        return paginated_data;
    }
};
PaginationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RethinkProvider")),
    __metadata("design:paramtypes", [Object])
], PaginationService);
exports.PaginationService = PaginationService;
//# sourceMappingURL=pagination.service.js.map
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
exports.TransportController = void 0;
const common_1 = require("@nestjs/common");
const transport_service_1 = require("./transport.service");
const transport_entity_1 = require("./transport.entity");
let TransportController = class TransportController {
    constructor(transportService) {
        this.transportService = transportService;
    }
    async list(query) {
        const response = await this.transportService
            .getList(query)
            .then((result) => {
            const current = query.page !== undefined ? Number(query.page) : 1;
            const numberOfItems = Object.keys(result).length;
            const numberPerPage = 3;
            const numberOfPages = Math.ceil(numberOfItems / numberPerPage);
            const trimStart = (current - 1) * numberPerPage;
            const trimEnd = trimStart + numberPerPage;
            const obj = result.toArray();
            const page_lists = obj._settledValue.slice(trimStart, trimEnd);
            const final_data = {
                page_lists: page_lists,
                numberOfPages: numberOfPages,
                currentPage: current,
                previousPage: current !== 1 ? current - 1 : 0,
                nextPage: current !== numberOfPages ? current + 1 : 0,
                perPage: numberPerPage,
                totalItems: numberOfItems,
            };
            return final_data;
        })
            .catch((error) => {
            return error;
        });
        return response;
    }
    async add(transport) {
        transport.expenses = Number(transport.expenses);
        const response = await this.transportService
            .insert(transport)
            .then((result) => {
            return 'Data successfully added.';
        })
            .catch((error) => {
            return error;
        });
        return response;
    }
    async edit(id) {
        const response = await this.transportService
            .getData(id)
            .then((result) => {
            return result;
        })
            .catch((error) => {
            return error;
        });
        return response;
    }
    async update(id, transport) {
        const data = {
            transport: transport.transport,
            expenses: transport.expenses,
            reason: transport.reason,
            time_start: transport.time_start,
            time_end: transport.time_end,
        };
        const response = await this.transportService
            .update(id, data)
            .then((result) => {
            if (result.replaced === 1) {
                return 'Data was successfully updated.';
            }
        })
            .catch((error) => {
            return error;
        });
        return response;
    }
    async delete(id) {
        const response = await this.transportService
            .delete(id)
            .then((result) => {
            return `Record has been deleted.`;
        })
            .catch((error) => {
            return error;
        });
        return response;
    }
    async reports(query) {
        console.log(query);
        const response = await this.transportService
            .getReports(query)
            .then((result) => {
            const label = [];
            const expense = [];
            const id = [];
            result.map((item) => {
                label.push(item.time_start.split('T')[0]);
                expense.push(item.expenses);
            });
            const data = {
                labels: label,
                expenses: expense,
                status: 200,
            };
            return data;
        })
            .catch((error) => {
            return error;
        });
        return response;
    }
    async search() {
        return [];
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transport_entity_1.Transport]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('edit/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "edit", null);
__decorate([
    (0, common_1.Put)('update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transport_entity_1.Transport]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "reports", null);
__decorate([
    (0, common_1.Get)('search'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransportController.prototype, "search", null);
TransportController = __decorate([
    (0, common_1.Controller)('api/transport'),
    __metadata("design:paramtypes", [transport_service_1.TransportService])
], TransportController);
exports.TransportController = TransportController;
//# sourceMappingURL=transport.controller.js.map
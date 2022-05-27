"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationModule = void 0;
const common_1 = require("@nestjs/common");
const database_provider_1 = require("../../../rethinkdb/database.provider");
const rethink_module_1 = require("../../../rethinkdb/rethink.module");
const pagination_service_1 = require("./pagination.service");
let PaginationModule = class PaginationModule {
};
PaginationModule = __decorate([
    (0, common_1.Module)({
        imports: [rethink_module_1.RethinkModule],
        controllers: [],
        providers: [pagination_service_1.PaginationService, database_provider_1.default],
        exports: [pagination_service_1.PaginationService]
    })
], PaginationModule);
exports.PaginationModule = PaginationModule;
//# sourceMappingURL=pagination.module.js.map
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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const rethink = require("rethinkdbdash");
const logger = new common_1.Logger('DB:SERVICE:RETHINK');
require('dotenv').config();
const { HOST = 'localhost', PORT = '28015', } = process.env;
let DatabaseService = class DatabaseService {
    constructor() {
        this.r = rethink({
            host: HOST,
            port: Number(PORT),
        });
    }
    onModuleInit() {
        logger.log(`Successfully Initialized Rethink Service`);
    }
    async getById(database, table, id) {
        return this.r.db(database).table(table).get(id);
    }
    async getByFilter(database, table, params) {
        return this.r.db(database).table(table).filter(params);
    }
    async list(database, table) {
        return this.r.db(database).table(table);
    }
    async insertRecord(database, table, params) {
        return this.r.db(database).table(table).insert(params);
    }
    async deleteRecord(database, table, id) {
        return this.r
            .db(database)
            .table(table)
            .get(id)
            .update({ status: 'Inactive', updated_date: new Date().getTime() });
    }
};
DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map
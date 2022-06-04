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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const rethinkdbdash_1 = __importDefault(require("rethinkdbdash"));
const bluebird_1 = __importDefault(require("bluebird"));
const logger = new common_1.Logger('DB:SERVICE:RETHINK');
require('dotenv').config();
const { HOST, PORT } = process.env;
let DatabaseService = class DatabaseService {
    constructor() {
        this.r = (0, rethinkdbdash_1.default)({
            host: HOST,
            port: Number(PORT),
        });
    }
    async createDatabase(database) {
        try {
            const dbLists = await this.listDatabase();
            if (dbLists.includes("emailAPI"))
                return;
            return this.r.dbCreate(database);
        }
        catch (error) {
            logger.log(error);
            return;
        }
    }
    async listDatabase() {
        return this.r.dbList();
    }
    async createTable(database, tables) {
        try {
            return await bluebird_1.default.each(tables, async (table) => {
                await this.r.db(database).tableCreate(table);
            });
        }
        catch (error) {
            return logger.log(error);
        }
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
        try {
            return await this.r.db(database).table(table).insert(params, { returnChanges: "always" });
        }
        catch (error) {
            return logger.warn(error);
        }
    }
    async updateRecord(database, table, id, params) {
        return this.r.db(database).table(table).get(id).update(params, { returnChanges: "always" });
    }
    async deleteRecord(database, table, id) {
        return this.r
            .db(database)
            .table(table)
            .get(id)
            .delete({ returnChanges: "always" });
    }
    async checkMessageInMenu(database, table, query) {
        if (query.id)
            return this.r.db(database).table(table).filter(function (item) {
                return item('id').eq(query.id).and(item('recipient')('email').eq(query.reference).and(item('recipient')('menu').eq(query.menu)).or(item('sender')('email').eq(query.reference).and(item('sender')('menu').eq(query.menu))));
            });
        return this.r.db(database).table(table).filter(function (item) {
            return item('recipient')('email').eq(query.reference).and(item('recipient')('menu').eq(query.menu)).or(item('sender')('email').eq(query.reference).and(item('sender')('menu').eq(query.menu)));
        });
    }
    async search(database, table, keyword, reference) {
        if (table === "messages")
            return this.r.db(database).table(table).filter(function (item) {
                return item('recipient')('email').eq(reference).or(item('sender')('email').eq(reference)).and(item('subject').match(keyword).or(item('message').match(keyword)));
            });
        return this.r.db(database).table(table).filter(function (item) {
            return item('email').match(keyword).or(item('username').match(keyword)).or(item('first_name').match(keyword).or(item('last_name').match(keyword)));
        });
    }
};
DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map
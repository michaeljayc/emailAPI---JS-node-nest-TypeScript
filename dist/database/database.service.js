"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const rethink = __importStar(require("rethinkdbdash"));
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
    async createDatabase(database) {
        try {
            return this.r.dbCreate(database);
        }
        catch (error) {
            logger.log(error);
            return;
        }
    }
    async createTable(database, tables) {
        console.log("🚀 ~ file: database.service.ts ~ line 33 ~ DatabaseService ~ createTable ~ tables", tables);
        try {
            if (tables.length)
                return await tables.forEach(async (table) => {
                    await this.r.db(database).tableCreate(table);
                });
        }
        catch (error) {
            logger.log(error);
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
        return this.r.db(database).table(table).insert(params, { returnChanges: "always" });
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
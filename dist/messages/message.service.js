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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const DB = "emailAPI";
const TABLE = "messages";
let MessageService = class MessageService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getMessageById(id) {
        return this.databaseService.getById(DB, TABLE, id);
    }
    async getMessages(data) {
        return this.databaseService.getByFilter(DB, TABLE, data);
    }
    async getMessageDetails(filtered) {
        return this.databaseService.getByFilter(DB, TABLE, filtered);
    }
    async sendMessage(message) {
        return this.databaseService.insertRecord(DB, TABLE, message);
    }
    async updateReadUnread(message_id, data) {
        return this.databaseService.updateRecord(DB, TABLE, message_id, data);
    }
    async updateMessage(id, message) {
        return this.databaseService.updateRecord(DB, TABLE, id, message);
    }
    async deleteMessage(message_id) {
        return this.databaseService.deleteRecord(DB, TABLE, message_id);
    }
    async checkMessageInMenu(query) {
        return this.databaseService.checkMessageInMenu(DB, TABLE, query);
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], MessageService);
exports.MessageService = MessageService;
exports.default = MessageService;
//# sourceMappingURL=message.service.js.map
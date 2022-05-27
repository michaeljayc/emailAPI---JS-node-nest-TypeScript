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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const rethink = require("rethinkdb");
const DB = "emailAPI";
const TABLE = "messages";
let MessageService = class MessageService {
    constructor(connection) {
        this.connection = connection;
    }
    async getMessageById(id) {
        return rethink
            .db(DB)
            .table("inbox")
            .get(id)
            .run(this.connection);
    }
    async getMessages(data) {
        return rethink
            .db(DB)
            .table(data.menu)
            .filter(data.filtered)
            .orderBy('updated_date')
            .run(this.connection);
    }
    async getMessageDetails(table, message_id) {
        return rethink
            .db(DB)
            .table(table)
            .get(message_id)
            .run(this.connection);
    }
    async sendMessage(table, message) {
        return rethink
            .db(DB)
            .table(table)
            .insert(message)
            .run(this.connection);
    }
    async updateReadUnread(message_id) {
        let res = await rethink
            .db(DB)
            .table("inbox")
            .get(message_id)
            .update({
            "read": true,
            "updated_date": String(Date.now())
        })
            .run(this.connection);
        return await this.getMessageDetails("inbox", message_id);
    }
    async updateMessage(table, id, message) {
        return rethink
            .db(DB)
            .table(table)
            .get(id)
            .update(message)
            .run(this.connection);
    }
    async deleteMessage(table, message_id) {
        return rethink
            .db(DB)
            .table(table)
            .get(message_id)
            .delete()
            .run(this.connection);
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RethinkProvider")),
    __metadata("design:paramtypes", [Object])
], MessageService);
exports.MessageService = MessageService;
exports.default = MessageService;
//# sourceMappingURL=message.service.js.map
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
const common_functions_1 = require("../common/common.functions");
const message_common_1 = require("./message.common");
const DB = "emailAPI";
const TABLE = "messages";
let MessageService = class MessageService {
    constructor(connection) {
        this.connection = connection;
    }
    async getMessageById(id) {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection);
    }
    async getMessages(data) {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(data)
            .orderBy('updated_date')
            .run(this.connection);
    }
    async getMessageDetails(message_id) {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(message_id)
            .run(this.connection);
    }
    async sendMessage(message) {
        return rethink
            .db(DB)
            .table(TABLE)
            .insert(message)
            .run(this.connection);
    }
    async updateReadUnread(message_id) {
        await rethink
            .db(DB)
            .table(TABLE)
            .get(message_id)
            .update({
            "status": message_common_1.STATE.read,
            "updated_date": (0, common_functions_1.setDateTime)()
        })
            .run(this.connection);
        return await this.getMessageDetails(message_id);
    }
    async updateMessage(id, message) {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .update(message)
            .run(this.connection);
    }
    async deleteMessage(message_id) {
        await rethink
            .db(DB)
            .table(TABLE)
            .get(message_id)
            .delete()
            .run(this.connection);
        return this.getMessageById(message_id);
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
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
const rethink = require("rethinkdbdash");
const common_functions_1 = require("../common/common.functions");
const message_common_1 = require("./message.common");
const { HOST = 'localhost', PORT = "28015" } = process.env;
const DB = "emailAPI";
const TABLE = "messages";
let MessageService = class MessageService {
    constructor(rethink) {
        this.rethink = rethink({
            host: HOST,
            port: Number(PORT)
        });
    }
    async getMessageById(id) {
        return this.rethink
            .db(DB)
            .table(TABLE)
            .get(id);
    }
    async getMessages(data) {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(data)
            .orderBy('updated_date');
    }
    async getMessageDetails(filtered) {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(filtered);
    }
    async sendMessage(message) {
        return rethink
            .db(DB)
            .table(TABLE)
            .insert(message, { returnChanges: true });
    }
    async updateReadUnread(message_id) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(message_id)
            .update({
            "status": message_common_1.STATE.read,
            "updated_date": (0, common_functions_1.setDateTime)()
        }, { returnChanges: "always" });
    }
    async updateMessage(id, message) {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .update(message, { returnChanges: "always" });
    }
    async deleteMessage(message_id) {
        await rethink
            .db(DB)
            .table(TABLE)
            .get(message_id)
            .delete({ returnChanges: "always" });
    }
    async checkMessageInMenu(query) {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(rethink.row('id').eq(query.id).and(rethink.row('recipient')('email').eq(query.reference).and(rethink.row('recipient')('menu').eq(query.menu)).or(rethink.row('sender')('email').eq(query.reference).and(rethink.row('sender')('menu').eq(query.menu)))));
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
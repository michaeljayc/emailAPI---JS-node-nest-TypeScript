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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const message_entity_1 = require("./message.entity");
const message_service_1 = require("./message.service");
const common = require("../common/common");
const logger_service_1 = require("../Services/logger.service");
const user_service_1 = require("../users/user.service");
let MessageController = class MessageController {
    constructor(messageService, jwtService, loggerService, userService) {
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.loggerService = loggerService;
        this.userService = userService;
    }
    async getMessages(request, query) {
        let menu = query.menu ? Number(query.menu) : 1;
        let formatted_response;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        const user_data = await this.jwtService.verifyAsync(cookie);
        let response = await this.messageService.getMessages(user_data.id, menu)
            .then(result => {
            formatted_response = common.formatResponse(result, true, "Success");
        });
        this.loggerService.insertLogs(common.formatLogs("getMessages", query, formatted_response));
        return formatted_response;
    }
    async createMessage(request, message) {
        let response;
        let formatted_response;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        let recipient_data = await this.userService.getUserByEmail(message.recipient);
        if (Object.keys(recipient_data._responses).length > 0)
            recipient_data = recipient_data.next()._settledValue;
        message.created_date = String(Date.now());
        message.updated_date = String(Date.now());
        if (message.isDraft)
            formatted_response = common.formatResponse([message], true, "Saved as draft.");
        if (message.menu_state === 4) {
            response = await this.messageService.createMessage(message);
            if (response.inserted === 1) {
                formatted_response = common.formatResponse([response], true, "Message sent.");
            }
        }
        this.loggerService.insertLogs(common.formatLogs("createMessage", message, formatted_response));
        return formatted_response;
        return;
    }
    async getMessageDetails(request, param) {
        const message_id = param.message_id;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        let response = await this.messageService.getMessageDetails(message_id)
            .then(result => {
            return common.formatResponse([result], true, "Success");
        })
            .catch(error => {
            return common.formatResponse([error], false);
        });
        this.loggerService.insertLogs(common.formatLogs("getMessageDetails", param, response));
        return response;
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)("new"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Get)(":message_id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessageDetails", null);
MessageController = __decorate([
    (0, common_1.Controller)("messages"),
    __metadata("design:paramtypes", [message_service_1.default,
        jwt_1.JwtService,
        logger_service_1.default,
        user_service_1.UserService])
], MessageController);
exports.MessageController = MessageController;
exports.default = MessageController;
//# sourceMappingURL=message.controller.js.map
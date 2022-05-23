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
const common_functions_1 = require("../common/common.functions");
const logger_service_1 = require("../services/logger.service");
const user_service_1 = require("../users/user.service");
const message_common_1 = require("./message.common");
const auth_token_guard_1 = require("../guards/auth-token/auth-token.guard");
let MessageController = class MessageController {
    constructor(messageService, jwtService, loggerService, userService) {
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.loggerService = loggerService;
        this.userService = userService;
    }
    async getMessages(request, query) {
        let filtered;
        let menu = query.menu ? query.menu : "inbox";
        let formatted_response;
        try {
            const cookie = request.cookies["jwt"];
            if ((0, message_common_1.isValidMenu)(menu)) {
                const user_data = await this
                    .jwtService
                    .verifyAsync(cookie);
                if ((0, message_common_1.isValidMenuTables)(menu)) {
                    if (menu === "inbox")
                        filtered = { "recipient_id": user_data.id };
                    else
                        filtered = { "sender_id": user_data.id };
                }
                else {
                    filtered = {
                        "menu_state": query.menu === "starred" ?
                            message_common_1.Menu.starred : message_common_1.Menu.important,
                        "recipient_id": user_data.id
                    };
                    menu = "inbox";
                }
                let response = await this
                    .messageService
                    .getMessages({
                    filtered,
                    menu,
                    id: user_data.id
                });
                formatted_response = (0, common_functions_1.formatResponse)(response, true, "Success");
            }
            else
                throw new common_1.BadRequestException(`Invalid Menu '${menu}'`);
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("getMessages", query, formatted_response));
        return formatted_response;
    }
    async getMessageDetails(request, param) {
        let formatted_response;
        try {
            let response = await this
                .messageService
                .getMessageDetails(param.menu, param.message_id);
            if (!response)
                throw new common_1.HttpException("Invalid menu or table", 404);
            if (param.menu === "inbox")
                response = await this.updateReadUnread(response.id);
            formatted_response = (0, common_functions_1.formatResponse)(response, true, "Success.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("getMessageDetails", param, formatted_response));
        return formatted_response;
    }
    async sendMessage(request, message) {
        let formatted_response;
        const drafted_message = message === null || message === void 0 ? void 0 : message.drafted;
        try {
            const sender_data = await this.jwtService.verifyAsync(request.cookies["jwt"]);
            let recipient_data = await this
                .userService
                .getUserByEmail(message.recipient);
            if (Object.keys(recipient_data._responses).length < 1)
                throw new common_1.NotFoundException(`${message.recipient}`, "Recipient doesn't exist");
            recipient_data = recipient_data.next()._settledValue;
            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());
            message.recipient_id = recipient_data.id;
            message.menu_state = 0;
            message.sender = sender_data.email;
            message.sender_id = sender_data.id;
            message.message_origin_id = "";
            message.read = false;
            message.drafted = false;
            formatted_response = await this
                .messageService
                .sendMessage("inbox", message)
                .then(result => {
                return (0, common_functions_1.formatResponse)([message], true, "Message Sent");
            });
            if (formatted_response.success)
                await this.messageService.sendMessage("sent", message);
            if (drafted_message)
                await this.messageService.deleteMessage("drafts", message.id);
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("sendMessage", message, formatted_response));
        return formatted_response;
    }
    async saveAsDraft(request, message) {
        let formatted_response;
        try {
            let sender_data = await this
                .jwtService
                .verifyAsync(request.cookies["jwt"]);
            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());
            message.sender = sender_data.email;
            message.sender_id = sender_data.id;
            message.drafted = true;
            message.read = false;
            let response = await this
                .messageService
                .sendMessage("drafts", message);
            formatted_response = (0, common_functions_1.formatResponse)(message, true, "Saved as draft.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("saveAsDraft", message, formatted_response));
        return formatted_response;
    }
    async updateDraftedMessage(request, message, query) {
        let formatted_response;
        try {
            const message_id = query.id;
            message.updated_date = String(Date.now());
            let response = await this
                .messageService
                .updateMessage("drafts", message_id, message);
            if (response.replaced === 1)
                formatted_response = (0, common_functions_1.formatResponse)([message], true, "Message updated.");
            else
                formatted_response = (0, common_functions_1.formatResponse)([query], false, "Message ID doesn't exist.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.statusMessage);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("updateMessage", message, formatted_response));
        return formatted_response;
    }
    async deleteMessage(request, param, query) {
        const table = param.menu;
        const message_id = query.id;
        let formatted_response;
        try {
            let response = await this
                .messageService
                .deleteMessage(table, message_id);
            if (response.deleted === 1)
                return (0, common_functions_1.formatResponse)([query], true, "Message deleted.");
            else
                return (0, common_functions_1.formatResponse)([query], false, `Message ID does not exist in ${table}`);
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("deleteMessage", param, formatted_response));
        return formatted_response;
    }
    async replyToMessage(query, message) {
        let formatted_response;
        try {
            if (!await this.messageService.getMessageById(query.id))
                throw new common_1.HttpException(`Message ID ${query.id} doesn't exist`, 404);
            const reply_recipient = message.sender;
            const reply_recipient_id = message.sender_id;
            if (!message.message_origin_id) {
                message.message_origin_id = query.message_id;
                message.subject = `RE: ${message.subject}`;
            }
            message.sender = message.recipient;
            message.sender_id = message.recipient_id;
            message.recipient = reply_recipient;
            message.recipient_id = reply_recipient_id;
            message.created_date = String(Date.now());
            message.updated_date = String(Date.now());
            message.read = false;
            message.drafted = false;
            message.menu_state = 0;
            let response = await this
                .messageService
                .sendMessage("inbox", message);
            console.log(response);
            if (response.inserted === 1)
                formatted_response = (0, common_functions_1.formatResponse)([message], true, "Reply sent.");
            else
                formatted_response = (0, common_functions_1.formatResponse)([query], false, `Error in sending reply.`);
            if (formatted_response.success)
                await this.messageService.sendMessage("sent", message);
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("replyToMessage", message, formatted_response));
        return formatted_response;
    }
    async setMenuState(request, param, query) {
        let formatted_response;
        try {
            if ((0, message_common_1.isValidMenuTables)(param.menu)) {
                let message = await this
                    .messageService
                    .getMessageDetails(param.menu, query.id);
                if (message) {
                    if (!Object.keys(message_common_1.STATE).includes(query.state))
                        throw new common_1.BadRequestException(`Invalid menu '${query.state}'`);
                    if (message.menu_state === message_common_1.Menu.starred ||
                        message.menu_state === message_common_1.Menu.important) {
                        message.menu_state = 0;
                    }
                    else {
                        message.menu_state = param.state === "starred" ?
                            message_common_1.Menu.starred :
                            message_common_1.Menu.important;
                    }
                    await this.messageService.updateMessage(param.menu, query.id, message);
                    formatted_response = (0, common_functions_1.formatResponse)([message], true, `Message set to ${query.state}`);
                }
                else
                    throw new common_1.BadRequestException(`${query.id} doesn't exist`);
            }
            else
                throw new common_1.BadRequestException(`Invalid menu ${param.menu}`);
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("setMenuState", { param, query }, formatted_response));
        return formatted_response;
    }
    async updateReadUnread(message_id) {
        return await this.messageService.updateReadUnread(message_id);
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Get)(":menu/:action/:message_id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessageDetails", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Post)("send"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Post)("save-as-draft"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "saveAsDraft", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Put)("drafts/update"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateDraftedMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Delete)(":menu/delete"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Post)("inbox/reply"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "replyToMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Put)(":menu"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "setMenuState", null);
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
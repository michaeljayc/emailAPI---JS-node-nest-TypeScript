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
const common_2 = require("../common/common");
let MessageController = class MessageController {
    constructor(messageService, jwtService, loggerService, userService) {
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.loggerService = loggerService;
        this.userService = userService;
    }
    async getMessages(request, query) {
        let table = query.menu ? query.menu : "inbox";
        let response;
        let formatted_response;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        if ((0, common_2.is_valid_menu)(query.menu)) {
            const user_data = await this.jwtService.verifyAsync(cookie);
            let need;
            if ((0, common_2.is_valid_menu_tables)(query.menu)) {
                if (table === "inbox") {
                    need = { "recipient_id": user_data.id };
                }
                else {
                    need = { "sender_id": user_data.id };
                }
            }
            else {
                need = { "menu_state": query.menu === "starred" ?
                        common_2.Menu.starred : common_2.Menu.important };
                table = query.menu;
            }
            const to_query = {
                need: need,
                table: query.menu,
                id: user_data.id
            };
            response = await this
                .messageService
                .getMessages(to_query)
                .then(result => {
                formatted_response = common
                    .formatResponse([result], true, "Success");
            })
                .catch(error => {
                formatted_response = common
                    .formatResponse([error], false, "Failed");
            });
        }
        else {
            return {
                statusCode: "404",
                message: `Invalid menu - (${query.menu})`
            };
        }
        this
            .loggerService
            .insertLogs(common
            .formatLogs("getMessages", query, formatted_response));
        return formatted_response;
    }
    async getMessageDetails(request, param) {
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        let response = await this
            .messageService
            .getMessageDetails(param.menu, param.message_id);
        if (!response)
            response = common
                .formatResponse([], false, "Message does not exist.");
        else {
            if (param.menu === "inbox") {
                response = await this.updateReadUnread(response)
                    .then(result => {
                    return common
                        .formatResponse([result], true, "Success");
                })
                    .catch(error => {
                    return common
                        .formatResponse([], false, "Failed");
                });
            }
        }
        this.loggerService
            .insertLogs(common
            .formatLogs("getMessageDetails", param, response));
        return response;
    }
    async sendMessage(request, message) {
        let formatted_response;
        let is_exist = message.id ? true : false;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        let recipient_data = await this
            .userService
            .getUserByEmail(message.recipient);
        if (Object.keys(recipient_data._responses).length < 1) {
            formatted_response = common.formatResponse([message], false, "Receipient does not exist.");
        }
        else {
            recipient_data = recipient_data.next()._settledValue;
            if (!is_exist)
                message.created_date = String(Date.now());
            message.updated_date = String(Date.now());
            message.recipient_id = recipient_data.id;
            formatted_response = await this
                .messageService
                .sendMessage("inbox", message)
                .then(result => {
                return common
                    .formatResponse([result], true, "Message Sent");
            })
                .catch(error => {
                return common
                    .formatResponse([error], false, "Failed");
            });
            if (formatted_response.success) {
                let response = await this
                    .messageService
                    .sendMessage("sent", message)
                    .then(result => {
                    return common
                        .formatResponse([result], true, "Message Sent");
                })
                    .catch(error => {
                    return common
                        .formatResponse([error], false, "Failed");
                });
            }
            if (is_exist) {
                let response = await this
                    .messageService
                    .deleteMessage("drafts", message.id)
                    .then(result => {
                    return common
                        .formatResponse([result], true, "Success");
                })
                    .catch(error => {
                    return common
                        .formatResponse([error], false, "Failed");
                });
            }
        }
        this
            .loggerService
            .insertLogs(common
            .formatLogs("sendMessage", message, formatted_response));
        return formatted_response;
    }
    async saveAsDraft(request, message) {
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        message.created_date = String(Date.now());
        message.updated_date = String(Date.now());
        let response = await this
            .messageService
            .sendMessage("drafts", message)
            .then(result => {
            return common
                .formatResponse([message], true, "Saved as draft");
        })
            .catch(error => {
            return common
                .formatResponse([message], false, "Failed");
        });
        this.loggerService.insertLogs(common.formatLogs("saveAsDraft", message, response));
        return response;
    }
    async updateDraftedMessage(request, message, query) {
        const message_id = query.id;
        let formatted_response;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        message.updated_date = String(Date.now());
        let response = await this
            .messageService
            .updateMessage("drafts", message_id, message);
        if (response.replaced === 1)
            formatted_response = common
                .formatResponse([response], true, "Message updated.");
        else
            formatted_response = common
                .formatResponse([response], false, "Failed to update message.");
        this.loggerService
            .insertLogs(common
            .formatLogs("updateMessage", response, formatted_response));
        return formatted_response;
    }
    async deleteMessage(request, param, query) {
        const table = param.menu;
        const message_id = query.id;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        let response = await this
            .messageService
            .deleteMessage(table, message_id)
            .then(result => {
            if (result.deleted === 1) {
                return common
                    .formatResponse([result], true, "Message deleted.");
            }
            else {
                return common
                    .formatResponse([result], false, "Message does not exist.");
            }
        })
            .catch(error => {
            return common
                .formatResponse([error], true, "Failed.");
        });
        this.loggerService
            .insertLogs(common
            .formatLogs("deleteMessage", { param, query }, response));
        return response;
    }
    async replyToMessage(request, param, message) {
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        const reply_recipient = message.sender;
        const reply_recipient_id = message.sender_id;
        if (!message.message_origin_id) {
            message.message_origin_id = param.message_id;
            message.subject = `RE: ${message.subject}`;
        }
        message.sender = message.recipient;
        message.sender_id = message.recipient_id;
        message.recipient = reply_recipient;
        message.recipient_id = reply_recipient_id;
        message.created_date = String(Date.now());
        message.updated_date = String(Date.now());
        let response = await this
            .messageService
            .sendMessage("inbox", message)
            .then(result => {
            return common
                .formatResponse([result], true, "Message sent.");
        })
            .catch(error => {
            return common
                .formatResponse([error], false, "Failed.");
        });
        this
            .loggerService
            .insertLogs(common.formatLogs("replyToMessage", message, response));
        return response;
    }
    async setMenuState(request, param) {
        let formatted_response = null;
        const cookie = request.cookies["jwt"];
        if (!cookie)
            throw new common_1.ForbiddenException;
        if ((0, common_2.is_valid_menu_tables)(param.menu)) {
            let message = await this
                .messageService
                .getMessageDetails(param.menu, param.message_id);
            if (message) {
                if (message.menu_state === common_2.Menu.starred ||
                    message.menu_state === common_2.Menu.important) {
                    message.menu_state = 0;
                }
                else {
                    message.menu_state = param.state === "starred" ?
                        common_2.Menu.starred :
                        common_2.Menu.important;
                }
                let response = await this
                    .messageService
                    .updateMessage(param.menu, param.message_id, message)
                    .then(result => {
                    return common.formatResponse([message], true, `Message menu_state updated`);
                })
                    .catch(error => {
                    return common.formatResponse([error], false, `Failed`);
                });
                formatted_response = response;
            }
            else {
                formatted_response = common
                    .formatResponse([param], false, "Message not found.");
            }
        }
        else {
            return {
                statusCode: "404",
                message: `'${param.menu}' not found.`
            };
        }
        return formatted_response;
    }
    async updateReadUnread(message) {
        return await this.messageService.updateReadUnread(message);
    }
};
__decorate([
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)(":menu/details/:message_id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessageDetails", null);
__decorate([
    (0, common_1.Post)("send"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)("save-as-draft"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "saveAsDraft", null);
__decorate([
    (0, common_1.Put)("drafts/update"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateDraftedMessage", null);
__decorate([
    (0, common_1.Delete)(":menu/delete"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Post)("inbox/reply/:message_id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, message_entity_1.default]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "replyToMessage", null);
__decorate([
    (0, common_1.Put)(":menu/:message_id/:state"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
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
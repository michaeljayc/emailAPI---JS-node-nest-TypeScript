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
const message_dto_1 = require("./message.dto");
const search_service_1 = require("../common/search/search.service");
const pagination_service_1 = require("../common/pagination/pagination.service");
const message_validator_pipe_1 = require("../pipes/message-validator.pipe");
let MessageController = class MessageController {
    constructor(messageService, jwtService, loggerService, userService, searchService, paginationService) {
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.loggerService = loggerService;
        this.userService = userService;
        this.searchService = searchService;
        this.paginationService = paginationService;
    }
    async getMessages(request, query) {
        let filtered;
        let response;
        let menu = query.menu ? query.menu : "inbox";
        let formatted_response;
        let page_number = (query.page !== undefined) ?
            Number(query.page) : 1;
        try {
            if ((0, message_common_1.isValidMenu)(menu)) {
                const user_data = await this
                    .jwtService
                    .verifyAsync(request.cookies["jwt"]);
                let email = user_data.email;
                if (menu === "sent" || menu === "drafts") {
                    filtered = { "sender": { "email": email,
                            "menu": message_common_1.MENU.sent
                        } };
                    if (menu === "drafts")
                        filtered.sender.menu = message_common_1.MENU.drafts;
                }
                else {
                    filtered = { "recipient": { "email": email } };
                    if (menu !== "inbox")
                        filtered.recipient.menu = (menu === "starred") ?
                            message_common_1.MENU.starred :
                            message_common_1.MENU.important;
                }
                response = await this
                    .messageService
                    .getMessages(filtered)
                    .then(result => {
                    return this
                        .paginationService
                        .pagination(result, page_number);
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
    async getMessageDetails(param) {
        let formatted_response;
        try {
            let response = await this
                .messageService
                .getMessageDetails(param.message_id);
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
        const newMessageDTO = new message_dto_1.NewMessageDTO();
        const default_message = (Object.assign(Object.assign({}, newMessageDTO), message));
        try {
            let recipient_data = await this
                .userService
                .getUserByEmail(message.recipient.email);
            if (Object.keys(recipient_data._responses).length < 1)
                throw new common_1.NotFoundException(`${message.recipient.email}`, "Recipient doesn't exist");
            default_message.sender.menu = message_common_1.MENU.sent;
            default_message.recipient.menu = message_common_1.MENU.inbox;
            formatted_response = await this
                .messageService
                .sendMessage(default_message)
                .then(result => {
                return (0, common_functions_1.formatResponse)(default_message, true, "Message Sent");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("sendMessage", default_message, formatted_response));
        return formatted_response;
    }
    async saveAsDraft(request, message) {
        let formatted_response;
        const newMessageDTO = new message_dto_1.NewMessageDTO();
        const default_message = (Object.assign(Object.assign({}, newMessageDTO), message));
        try {
            default_message.status = message_common_1.STATE.draft;
            default_message.sender.menu = message_common_1.MENU.drafts;
            await this
                .messageService
                .sendMessage(default_message);
            formatted_response = (0, common_functions_1.formatResponse)(default_message, true, "Saved as draft.");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("saveAsDraft", default_message, formatted_response));
        return formatted_response;
    }
    async updateDraftedMessage(request, message, query) {
        let formatted_response;
        try {
            const message_id = query.id;
            message.updated_date = (0, common_functions_1.setDateTime)();
            let response = await this
                .messageService
                .updateMessage(message_id, message);
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
    async sendDraftMessage(message, query) {
        let formatted_response;
        const newMessageDTO = new message_dto_1.NewMessageDTO();
        const default_message = (Object.assign(Object.assign({}, newMessageDTO), message));
        try {
            const response = await this
                .messageService
                .getMessageById(query.id);
            if (!response)
                throw new common_1.NotFoundException(`ID: ${query.id} doesn't exist`);
            const def_message = (Object.assign(Object.assign({}, default_message), { recipient: Object.assign(Object.assign({}, default_message.recipient), { menu: message_common_1.MENU.inbox }), sender: Object.assign(Object.assign({}, default_message.sender), { menu: message_common_1.MENU.sent }), status: 0, updated_date: (0, common_functions_1.setDateTime)() }));
            formatted_response = await this
                .messageService
                .updateMessage(query.id, def_message)
                .then(result => {
                return (0, common_functions_1.formatResponse)(def_message, true, "Message Sent.");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.statusMessage);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("sendDraftMessage", query, formatted_response));
        return formatted_response;
    }
    async deleteMessage(request, param, query) {
        const message_id = query.id;
        let formatted_response;
        try {
            if (!message_common_1.menu.includes(param.menu))
                throw new common_1.BadRequestException(`Menu ${param.menu} doesn't exist.`);
            formatted_response = await this
                .messageService
                .deleteMessage(message_id)
                .then(result => {
                return (0, common_functions_1.formatResponse)({ query }, true, "Message Deleted");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("deleteMessage", { param, query }, formatted_response));
        return formatted_response;
    }
    async replyToMessage(query, message) {
        let formatted_response;
        const newMessageDTO = new message_dto_1.NewMessageDTO();
        const default_message = (Object.assign(Object.assign({}, newMessageDTO), message));
        try {
            if (!await this.messageService.getMessageById(query.id))
                throw new common_1.HttpException(`Message ID ${query.id} doesn't exist`, 404);
            const def_message = (Object.assign(Object.assign({}, default_message), { message_origin_id: (!default_message.message_origin_id) ?
                    query.id :
                    default_message.message_origin_id, subject: (!default_message.message_origin_id) ?
                    `RE: ${default_message.subject}` :
                    default_message.subject, recipient: Object.assign(Object.assign({}, default_message.recipient), { menu: message_common_1.MENU.inbox }), sender: Object.assign(Object.assign({}, default_message.sender), { menu: message_common_1.MENU.sent }) }));
            formatted_response = await this
                .messageService
                .sendMessage(def_message)
                .then(result => {
                return (0, common_functions_1.formatResponse)(def_message, true, "Reply sent.");
            });
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("replyToMessage", default_message, formatted_response));
        return formatted_response;
    }
    async updateMessageStatus(request, message, query) {
        const { id, state } = query;
        let formatted_response;
        const newMessageDTO = new message_dto_1.NewMessageDTO();
        const default_message = (Object.assign(Object.assign({}, newMessageDTO), message));
        try {
            let response = await this
                .messageService
                .getMessageById(id);
            if (!response)
                throw new common_1.NotFoundException(`ID ${id} doesn't exist.`);
            const def_message = Object.assign(Object.assign({}, default_message), { recipient: Object.assign(Object.assign({}, default_message.recipient), { menu: state === "starred" ?
                        message_common_1.MENU.starred :
                        message_common_1.MENU.important }) });
            await this.messageService.updateMessage(id, def_message);
            formatted_response = (0, common_functions_1.formatResponse)(def_message, true, `Message set to ${state}`);
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.status);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("setMenuState", query, formatted_response));
        return formatted_response;
    }
    async search(request, query) {
        let formatted_response;
        let response_data;
        try {
            const cookie = await this.jwtService.verifyAsync(request.cookies["jwt"]);
            response_data = await this
                .searchService
                .search(query.keyword, cookie.email, "inbox");
            let response_data_length = response_data._responses.length;
            if (response_data_length > 0) {
                response_data = response_data._responses[0].r;
            }
            formatted_response = (0, common_functions_1.formatResponse)((response_data_length > 0) ? response_data : null, true, "Success");
        }
        catch (error) {
            formatted_response = (0, common_functions_1.formatResponse)([error], false, error.statusMessage);
        }
        this
            .loggerService
            .insertLogs((0, common_functions_1.formatLogs)("search", query, formatted_response));
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
    (0, common_1.Get)(":menu/details/:message_id"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    (0, common_1.Put)("drafts/send"),
    __param(0, (0, common_1.Body)(message_validator_pipe_1.MessageValidationPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_entity_1.default, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendDraftMessage", null);
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
    (0, common_1.Put)("inbox"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_entity_1.default, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateMessageStatus", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "search", null);
MessageController = __decorate([
    (0, common_1.Controller)("messages"),
    __metadata("design:paramtypes", [message_service_1.default,
        jwt_1.JwtService,
        logger_service_1.default,
        user_service_1.UserService,
        search_service_1.SearchService,
        pagination_service_1.PaginationService])
], MessageController);
exports.MessageController = MessageController;
exports.default = MessageController;
//# sourceMappingURL=message.controller.js.map
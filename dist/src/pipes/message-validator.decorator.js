"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class MessageValidationPipe {
    transform(value) {
        this.checkRecipientObject(value.recipient);
        this.checkRecipientEmailIsNotEmpty(value.recipient.email);
        return value;
    }
    checkRecipientObject(recipient) {
        if (!recipient)
            throw new common_1.BadRequestException("Provide recipient details");
    }
    checkRecipientEmailIsNotEmpty(email) {
        if (!email) {
            throw new common_1.BadRequestException("Provide recipient's email.");
        }
    }
}
exports.MessageValidationPipe = MessageValidationPipe;
//# sourceMappingURL=message-validator.decorator.js.map
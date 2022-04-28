"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incorrectUserPassword = exports.userEmailDoesNotExist = void 0;
const common_1 = require("./common");
const userEmailDoesNotExist = (email) => {
    let message = `${email} does not exist.`;
    const response = new common_1.ResponseFormat();
    response.success = false;
    response.count = 0;
    response.message = message;
    response.data = null;
    return response;
};
exports.userEmailDoesNotExist = userEmailDoesNotExist;
const incorrectUserPassword = () => {
    let message = "Incorrect Password.";
    const response = new common_1.ResponseFormat();
    response.success = false;
    response.count = 0;
    response.message = message;
    response.data = null;
    return response;
};
exports.incorrectUserPassword = incorrectUserPassword;
//# sourceMappingURL=errors.js.map
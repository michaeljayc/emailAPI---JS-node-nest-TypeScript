"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incorrectUserPassword = exports.userEmailDoesNotExist = void 0;
const userEmailDoesNotExist = (email) => {
    let status = `${email} does not exist.`;
    const response = {
        success: false,
        count: 0,
        message: status,
        data: null,
    };
    return response;
};
exports.userEmailDoesNotExist = userEmailDoesNotExist;
const incorrectUserPassword = () => {
    let status = "Incorrect Password.";
    const response = {
        success: false,
        count: 0,
        message: status,
        data: null,
    };
    return response;
};
exports.incorrectUserPassword = incorrectUserPassword;
//# sourceMappingURL=errors.js.map
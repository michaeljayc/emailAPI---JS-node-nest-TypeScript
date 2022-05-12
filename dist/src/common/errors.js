"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incorrectUserPassword = exports.userEmailDoesNotExist = void 0;
const userEmailDoesNotExist = (email) => ({
    success: false,
    count: 0,
    message: `${email} does not exist.`,
    data: null,
});
exports.userEmailDoesNotExist = userEmailDoesNotExist;
const incorrectUserPassword = () => ({
    success: false,
    count: 0,
    message: "Incorrect Password.",
    data: null
});
exports.incorrectUserPassword = incorrectUserPassword;
//# sourceMappingURL=errors.js.map
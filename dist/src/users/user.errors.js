"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEmailDoesNotExist = exports.incorrectUserPassword = void 0;
const incorrectUserPassword = () => ({
    success: false,
    count: 0,
    message: "Incorrect Password.",
    data: []
});
exports.incorrectUserPassword = incorrectUserPassword;
const userEmailDoesNotExist = (email) => ({
    success: false,
    count: 0,
    message: `${email} does not exist.`,
    data: [],
});
exports.userEmailDoesNotExist = userEmailDoesNotExist;
//# sourceMappingURL=user.errors.js.map
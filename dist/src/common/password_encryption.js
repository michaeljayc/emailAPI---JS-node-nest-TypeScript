"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatch = exports.passwordEncryption = void 0;
const bcrypt = require("bcrypt");
async function passwordEncryption(password) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
exports.passwordEncryption = passwordEncryption;
async function isMatch(password, inputtedPassword) {
    return await bcrypt.compare(password, inputtedPassword);
}
exports.isMatch = isMatch;
//# sourceMappingURL=password_encryption.js.map
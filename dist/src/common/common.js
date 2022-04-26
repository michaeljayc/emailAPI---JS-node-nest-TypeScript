"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = exports.ResponseFormat = exports.setDateTime = void 0;
const d = new Date();
const setDateTime = () => {
    return d.toLocaleDateString() + ' - ' + d.toLocaleTimeString();
};
exports.setDateTime = setDateTime;
class ResponseFormat {
    constructor() { }
}
exports.ResponseFormat = ResponseFormat;
const formatResponse = (user) => {
    const response = new ResponseFormat();
    response.count = Object.keys(user).length;
    response.success = true;
    response.message = "Success";
    response.data = user;
    return response;
};
exports.formatResponse = formatResponse;
//# sourceMappingURL=common.js.map
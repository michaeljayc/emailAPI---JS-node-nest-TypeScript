"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLogs = exports.formatResponse = exports.ResponseFormat = exports.setDateTime = void 0;
const DATE = new Date;
const setDateTime = () => {
    return DATE.toLocaleDateString() + ' - ' + DATE.toLocaleTimeString();
};
exports.setDateTime = setDateTime;
class ResponseFormat {
    constructor() { }
}
exports.ResponseFormat = ResponseFormat;
const formatResponse = (data) => {
    const response = new ResponseFormat();
    response.count = Object.keys(data).length;
    response.success = true;
    response.message = "Success";
    response.data = data;
    return response;
};
exports.formatResponse = formatResponse;
const formatLogs = (func_name, data, response) => {
    return {
        timestamp: DATE.toLocaleDateString() + ' ' + DATE.toLocaleTimeString(),
        request: {
            function_name: func_name,
            params: data
        },
        response: response
    };
};
exports.formatLogs = formatLogs;
//# sourceMappingURL=common.js.map
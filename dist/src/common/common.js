"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncatePassword = exports.formatLogs = exports.formatResponse = exports.ResponseFormat = exports.setDateTime = void 0;
const DATE = new Date;
const setDateTime = () => {
    return DATE.toLocaleDateString() + ' - ' + DATE.toLocaleTimeString();
};
exports.setDateTime = setDateTime;
class ResponseFormat {
    constructor() { }
}
exports.ResponseFormat = ResponseFormat;
const formatResponse = (data, success, message) => {
    const truncated_data = data ? data : null;
    if (truncated_data !== null) {
        truncated_data.forEach(value => {
            delete value.password;
        });
    }
    const response = new ResponseFormat();
    response.count = Object.keys(data).length;
    response.success = success ? success : false;
    response.message = message ? message : "Failed";
    response.data = truncated_data;
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
const truncatePassword = (user) => {
    console.log(user);
    return user;
};
exports.truncatePassword = truncatePassword;
//# sourceMappingURL=common.js.map
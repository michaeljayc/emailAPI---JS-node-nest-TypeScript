"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLogs = exports.formatResponse = exports.setDateTime = void 0;
const DATE = new Date;
const setDateTime = () => DATE.toLocaleDateString() + ' - ' + DATE.toLocaleTimeString();
exports.setDateTime = setDateTime;
const formatResponse = (data, isSuccessful, status) => {
    let truncated_data = data !== null && data !== void 0 ? data : null;
    if (!truncated_data) {
        truncated_data.forEach(value => {
            delete value.password;
        });
    }
    return {
        count: Object.keys(data).length,
        success: (isSuccessful) ? isSuccessful : false,
        message: (status) ? status : "Failed",
        datas: truncated_data
    };
};
exports.formatResponse = formatResponse;
const formatLogs = (func_name, data, response) => ({
    timestamp: DATE.toLocaleDateString() + ' ' + DATE.toLocaleTimeString(),
    request: {
        function_name: func_name,
        params: data
    },
    response: response
});
exports.formatLogs = formatLogs;
//# sourceMappingURL=common.functions.js.map
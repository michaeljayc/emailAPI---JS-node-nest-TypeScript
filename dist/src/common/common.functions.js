"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hidePasswordProperty = exports.formatLogs = exports.formatResponse = exports.setDateTime = void 0;
const DATE = new Date;
const setDateTime = () => DATE.toLocaleDateString() + ' - ' + DATE.toLocaleTimeString();
exports.setDateTime = setDateTime;
const formatResponse = (data, isSuccessful, status) => {
    var _a;
    let truncated_data = data !== null && data !== void 0 ? data : [];
    if (!truncated_data) {
        truncated_data.forEach(value => {
            return value;
        });
    }
    return {
        count: (_a = truncated_data.length) !== null && _a !== void 0 ? _a : 1,
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
const hidePasswordProperty = (user_data) => {
    console.log(user_data);
};
exports.hidePasswordProperty = hidePasswordProperty;
//# sourceMappingURL=common.functions.js.map
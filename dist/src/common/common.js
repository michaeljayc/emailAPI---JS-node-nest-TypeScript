"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_valid_menu = exports.is_valid_menu_tables = exports.menu_tables = exports.Menu = exports.truncatePassword = exports.formatLogs = exports.formatResponse = exports.setDateTime = void 0;
const DATE = new Date;
const setDateTime = () => {
    return DATE.toLocaleDateString() + ' - ' + DATE.toLocaleTimeString();
};
exports.setDateTime = setDateTime;
const formatResponse = (data, isSuccessful, status) => {
    let truncated_data = data ? data : null;
    if (truncated_data !== null) {
        truncated_data.forEach(value => {
            delete value.password;
        });
    }
    const response = {
        count: Object.keys(data).length,
        success: (isSuccessful) ? isSuccessful : false,
        message: (status) ? status : "Failed",
        datas: truncated_data
    };
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
exports.Menu = {
    "inbox": 1,
    "sent": 2,
    "drafts": 3,
    "starred": 4,
    "important": 5
};
exports.menu_tables = ["inbox", "sent", "drafts"];
const is_valid_menu_tables = (menu) => {
    return exports.menu_tables.includes(menu);
};
exports.is_valid_menu_tables = is_valid_menu_tables;
const is_valid_menu = (menu) => {
    const menu_keys = Object.keys(exports.Menu);
    return menu_keys.includes(menu);
};
exports.is_valid_menu = is_valid_menu;
//# sourceMappingURL=common.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidStatus = exports.isValidMenu = exports.isValidMenuTables = exports.STATE = exports.MENU = exports.STATUS_ARRAY = exports.MENU_ARRAY = void 0;
exports.MENU_ARRAY = ["inbox", "sent", "draft", "starred", "important"];
exports.STATUS_ARRAY = ["important", "starred", "read", "draft", "deleted"];
exports.MENU = {
    "inbox": 1,
    "starred": 2,
    "important": 3,
    "sent": 4,
    "drafts": 5
};
exports.STATE = {
    "important": 1,
    "starred": 2,
    "read": 3,
    "draft": 4,
    "deleted": 5
};
const isValidMenuTables = (chosen_menu) => exports.MENU_ARRAY.includes(chosen_menu);
exports.isValidMenuTables = isValidMenuTables;
const isValidMenu = (menu) => {
    const menu_keys = Object.keys(exports.MENU);
    return menu_keys.includes(menu);
};
exports.isValidMenu = isValidMenu;
const isValidStatus = (status) => exports.STATUS_ARRAY.includes(status);
exports.isValidStatus = isValidStatus;
//# sourceMappingURL=message.common.js.map
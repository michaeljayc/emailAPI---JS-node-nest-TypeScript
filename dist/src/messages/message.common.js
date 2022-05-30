"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMenu = exports.isValidMenuTables = exports.STATE = exports.MENU = exports.menu = void 0;
exports.menu = ["inbox", "sent", "draft", "starred", "important"];
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
const isValidMenuTables = (chosen_menu) => exports.menu.includes(chosen_menu);
exports.isValidMenuTables = isValidMenuTables;
const isValidMenu = (menu) => {
    const menu_keys = Object.keys(exports.MENU);
    return menu_keys.includes(menu);
};
exports.isValidMenu = isValidMenu;
//# sourceMappingURL=message.common.js.map
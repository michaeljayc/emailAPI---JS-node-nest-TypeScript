"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMenu = exports.isValidMenuTables = exports.STATE = exports.Menu = exports.menu_tables = void 0;
exports.menu_tables = ["inbox", "sent", "drafts"];
exports.Menu = {
    "inbox": 1,
    "sent": 2,
    "drafts": 3,
    "starred": 4,
    "important": 5
};
exports.STATE = {
    "starred": 1,
    "important": 2,
    "deleted": 3
};
const isValidMenuTables = (menu) => exports.menu_tables.includes(menu);
exports.isValidMenuTables = isValidMenuTables;
const isValidMenu = (menu) => {
    const menu_keys = Object.keys(exports.Menu);
    return menu_keys.includes(menu);
};
exports.isValidMenu = isValidMenu;
//# sourceMappingURL=message.common.js.map
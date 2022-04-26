"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RethinkProvider = void 0;
const rethink = require("rethinkdb");
exports.RethinkProvider = {
    provide: 'RethinkProvider',
    useFactory: async () => {
        const conn = await rethink.connect('localhost');
        return conn;
    },
};
exports.default = exports.RethinkProvider;
//# sourceMappingURL=database.provider.js.map
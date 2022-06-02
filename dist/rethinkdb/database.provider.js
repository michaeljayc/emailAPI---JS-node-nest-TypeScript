"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RethinkProvider = void 0;
const rethink = require("rethinkdbdash");
require('dotenv').config();
const { HOST = 'localhost', PORT = "28015" } = process.env;
exports.RethinkProvider = {
    provide: 'RethinkProvider',
    useFactory: async () => {
        const conn = await rethink({
            host: HOST,
            port: Number(PORT)
        });
        return conn;
    },
};
exports.default = exports.RethinkProvider;
//# sourceMappingURL=database.provider.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RethinkProvider = void 0;
const rethink = require("rethinkdb");
require('dotenv').config();
const { HOST } = process.env;
exports.RethinkProvider = {
    provide: 'RethinkProvider',
    useFactory: async () => {
        const conn = await rethink.connect(HOST);
        return conn;
    },
};
exports.default = exports.RethinkProvider;
//# sourceMappingURL=database.provider.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const rethink = require("rethinkdb");
const bcrypt = require('bcrypt');
const TABLE = "users";
const DB = "emailAPI";
let AuthService = class AuthService {
    constructor(connection) {
        this.connection = connection;
    }
    async getUserData(email) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .filter({
            'email': email
        })
            .run(this.connection);
    }
    async ecnryptPassword(password) {
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(password, salt);
        return hashed_password;
    }
    async comparePassword(newPassword, passwordHash) {
        return await bcrypt.compare(newPassword, passwordHash);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RethinkProvider")),
    __metadata("design:paramtypes", [Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const rethink = require("rethinkdb");
const TABLE = "users";
const DB = "emailAPI";
let UserService = class UserService {
    constructor(connection) {
        this.connection = connection;
    }
    async registerUser(user) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .insert(user)
            .run(this.connection);
    }
    async loginUser(id) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection);
    }
    async getAllUsers() {
        return await rethink
            .db(DB)
            .table(TABLE)
            .orderBy('updated_date')
            .run(this.connection);
    }
    async getUserById(id) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection);
    }
    async getUserByUsername(username) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .filter({ "username": username })
            .run(this.connection);
    }
    async getUserByEmail(email) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .filter({
            'email': email
        })
            .run(this.connection);
    }
    async updateUser(user, user_id) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(user_id)
            .update(user)
            .run(this.connection);
    }
    async deleteUser(id) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .delete()
            .run(this.connection);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("RethinkProvider")),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const common_functions_1 = require("../src/common/common.functions");
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        const test = context
            .switchToHttp().getRequest().headers['user-agent'];
        return next
            .handle()
            .pipe((0, operators_1.tap)(data => {
            let obj_data = data.datas;
            if (obj_data && obj_data.length > 1) {
                obj_data = obj_data.map(item => {
                    return item;
                });
            }
            console.log((0, common_functions_1.formatResponse)(obj_data, data.success, data.message));
        }), (0, operators_1.catchError)(err => {
            console.log(`Error: ${err}`);
            throw err;
        }));
    }
};
LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map
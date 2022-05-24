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
let LoggingInterceptor = class LoggingInterceptor {
    intercept(context, next) {
        const request = {
            "class": context.getClass().name,
            "function": context.getHandler().name,
            "params": context.getArgs()[0].params,
            "query": context.getArgs()[0].query,
        };
        const log_path = context.getArgs()[0].path;
        const logger = new common_1.Logger(log_path.toUpperCase());
        logger.log(`[REQUEST]: ${JSON.stringify(request)}`);
        return next
            .handle()
            .pipe((0, operators_1.tap)((res) => logger.log(`[RESPONSE]: ${JSON.stringify(res)}`), (res) => {
            logger.error(`[${log_path}]: ${JSON.stringify(res)}`);
        }));
    }
};
LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map
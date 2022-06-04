"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
async function bootstrap() {
    const opts = {};
    const app = await core_1.NestFactory.create(app_module_1.AppModule, opts);
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.setGlobalPrefix("api");
    app.use((0, cookie_parser_1.default)());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe);
    app.enableCors({
        credentials: true,
        origin: '*',
        allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
async function bootstrap() {
    const opts = {};
    const app = await core_1.NestFactory.create(app_module_1.AppModule, opts);
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.setGlobalPrefix("api");
    app.use(cookieParser());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter);
    app.enableCors({
        credentials: true,
        origin: '*',
        allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
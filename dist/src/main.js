"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const opts = {};
    const app = await core_1.NestFactory.create(app_module_1.AppModule, opts);
    app.setGlobalPrefix("api");
    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        origin: '*',
        allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
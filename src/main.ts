import { NestApplicationOptions } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './Services/http-exception.filter';
import { LoggingInterceptor } from './Services/logging.interceptor';

async function bootstrap() {
  const opts: NestApplicationOptions = {};
  const app = await NestFactory.create(AppModule,opts);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggingInterceptor)
  app.useGlobalFilters(new HttpExceptionFilter)
 // === For access ===
  app.enableCors({
    credentials: true,
    origin: '*',
    allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
  });

  await app.listen(3000);
}
bootstrap();

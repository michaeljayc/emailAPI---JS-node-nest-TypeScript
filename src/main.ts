import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const opts: NestApplicationOptions = {};
  const app = await NestFactory.create(AppModule,opts);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggingInterceptor())
  // app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe)
  
 // === For access ===
  app.enableCors({
    credentials: true,
    origin: '*',
    allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
  });

  await app.listen(3000);
}
bootstrap();

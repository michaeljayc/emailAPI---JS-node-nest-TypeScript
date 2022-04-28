import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const opts: NestApplicationOptions = {};
  const app = await NestFactory.create(AppModule,opts);
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  
 // === For access ===
  app.enableCors({
    credentials: true,
    origin: '*',
    allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
  });

  await app.listen(3000);
}
bootstrap();

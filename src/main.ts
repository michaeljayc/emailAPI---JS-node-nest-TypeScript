import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 // === For access ===
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
  });

  await app.listen(3000);
}
bootstrap();

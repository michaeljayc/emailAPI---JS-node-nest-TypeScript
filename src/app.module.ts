import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './users/user.module';
import { UserRoleModule } from './user_roles/user_role.module';
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './messages/message.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import LoggerService from './services/logger.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    UserRoleModule, 
    UserModule,
    AuthModule,
    MessageModule,
    JwtModule.register({
      secret: "secret",
      signOptions: {expiresIn: '1d'}
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    LoggerService,
  ],
  exports:[]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { RethinkModule } from 'rethinkdb/rethink.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { UserRoleModule } from './user_roles/user_role.module';
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './messages/message.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './Services/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    RethinkModule, 
    UserRoleModule, 
    UserModule,
    AuthModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
  ],
  exports:[AppService]
})
export class AppModule {}

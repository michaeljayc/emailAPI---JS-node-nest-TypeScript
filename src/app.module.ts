import { Module } from '@nestjs/common';
import { RethinkModule } from 'rethinkdb/rethink.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { UserRoleModule } from './user_roles/user_role.module';
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    RethinkModule, 
    UserRoleModule, 
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

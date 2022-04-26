import { Module } from '@nestjs/common';
import { RethinkModule } from 'rethinkdb/rethink.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user.module';
import { UserRoleModule } from './Modules/user_role.module';

@Module({
  imports: [RethinkModule, UserRoleModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

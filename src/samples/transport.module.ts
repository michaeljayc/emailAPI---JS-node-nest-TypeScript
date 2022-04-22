import { Module } from '@nestjs/common';
import { RethinkProvider } from '../../../rethinkdb/database.provider';
import { RethinkModule } from '../../../rethinkdb/rethink.module';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

@Module({
  imports: [RethinkModule],
  controllers: [TransportController],
  providers: [TransportService, RethinkProvider],
})
export class TransportModule {}

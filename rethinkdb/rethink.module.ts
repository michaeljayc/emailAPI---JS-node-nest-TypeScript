import { Module } from '@nestjs/common';
import { RethinkProvider } from './database.provider';

@Module({
    imports: [],
    controllers: [],
    providers: [RethinkProvider],
    exports: [RethinkProvider]
})

export class RethinkModule {}
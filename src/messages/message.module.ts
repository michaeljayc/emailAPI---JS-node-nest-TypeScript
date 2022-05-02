import { Module } from "@nestjs/common";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import MessageController from "./message.controller";
import MessageService from "./message.service";

@Module({
    imports: [RethinkModule],
    controllers: [MessageController],
    providers: [MessageService, RethinkProvider],
})

export class MessageModule {}
import { Module } from "@nestjs/common";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { PaginationService } from "./pagination.service";

@Module({
    imports:[RethinkModule],
    controllers: [],
    providers: [PaginationService, RethinkProvider],
    exports: [PaginationService]
})

export class PaginationModule {}
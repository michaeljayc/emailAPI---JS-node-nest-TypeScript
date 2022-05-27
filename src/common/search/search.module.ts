import { Module } from "@nestjs/common";
import RethinkProvider from "rethinkdb/database.provider";
import { RethinkModule } from "rethinkdb/rethink.module";
import { SearchService } from "./search.service";

@Module({
    imports: [RethinkModule],
    controllers: [],
    providers: [SearchService, RethinkProvider],
    exports: [SearchService]
})

export class SearchModule {}
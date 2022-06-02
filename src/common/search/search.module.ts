import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { SearchService } from "./search.service";

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [SearchService],
    exports: [SearchService]
})

export class SearchModule {}
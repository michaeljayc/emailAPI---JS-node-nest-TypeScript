import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { PaginationService } from "./pagination.service";

@Module({
    imports:[DatabaseModule],
    controllers: [],
    providers: [PaginationService],
    exports: [PaginationService]
})

export class PaginationModule {}
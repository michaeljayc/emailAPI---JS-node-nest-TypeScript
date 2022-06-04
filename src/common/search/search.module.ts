import { Logger, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "src/database/database.module";
import { AuthTokenModule } from "src/guards/auth-token/auth-token.module";
import LoggerService from "src/services/logger.service";
import { PaginationModule } from "../pagination/pagination.module";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
    imports: [DatabaseModule,
        AuthTokenModule,
        PaginationModule,
        JwtModule.register({
            secret: "secret",
            signOptions: {expiresIn: '1d'}
        }),],
    controllers: [SearchController],
    providers: [SearchService, LoggerService],
    exports: [SearchService]
})

export class SearchModule {}
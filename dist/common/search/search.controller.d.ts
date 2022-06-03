import { JwtService } from "@nestjs/jwt";
import { IResponseFormat } from "../common.interface";
import { Request } from "express";
import { SearchService } from "./search.service";
import { PaginationService } from "../pagination/pagination.service";
import LoggerService from "src/services/logger.service";
export declare class SearchController {
    private searchService;
    private jwtService;
    private paginationService;
    private loggerService;
    constructor(searchService: SearchService, jwtService: JwtService, paginationService: PaginationService, loggerService: LoggerService);
    search(request: Request, query: any): Promise<IResponseFormat>;
}
export default SearchController;

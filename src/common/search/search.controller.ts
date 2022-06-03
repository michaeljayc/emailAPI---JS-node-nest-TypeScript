import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenGuard } from "src/guards/auth-token/auth-token.guard";
import { RoleGuard } from "src/user_roles/role.decorator";
import { Role } from "src/user_roles/role.enum";
import { IResponseFormat } from "../common.interface";
import { Request } from "express"
import { SearchService } from "./search.service";
import { PaginationService } from "../pagination/pagination.service";
import { formatLogs, formatResponse } from "../common.functions";
import LoggerService from "src/services/logger.service";

@Controller("search")
export class SearchController {

    constructor(private searchService: SearchService,
        private jwtService: JwtService,
        private paginationService: PaginationService,
        private loggerService: LoggerService){}

     // http://localhost:3000/api/search?table=users&keyword=123abc
     @UseGuards(AuthTokenGuard)
     @RoleGuard(Role.Admin)
     @Get("")
     async search(@Req() request: Request,
        @Query() query): Promise<IResponseFormat> {

            const keyword = query.keyword ?? "";

            let formatted_response: IResponseFormat;
            let page_number = (query.page !== undefined) ? 
            Number(query.page) : 1;

            try {
                // get cookie
                const cookie = await this
                    .jwtService
                    .verifyAsync(request.cookies["jwt"]);
            
                const response = await this
                    .searchService
                    .search("users", query.keyword, cookie.email)
                    .then( result => {
                        console.log(result)
                        return this
                            .paginationService
                            .pagination(result, page_number)
                    })
                    
                formatted_response = formatResponse
                    ((response) ? response : null, true, "Success")
            } catch (error) {
                formatted_response = formatResponse
                    ([error], false, error.statusMessage)
            }

            this
            .loggerService
            .insertLogs(formatLogs
                ("search", query, formatted_response)
            )
            
            return formatted_response;
            return
     }
}

export default SearchController;
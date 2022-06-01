import { Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdb";

@Injectable()
export class PaginationService {

    private connection: rethink.Connection;
    constructor(@Inject("RethinkProvider") connection){
        this.connection = connection;
    }

    async pagination(data: any, page: number) {
        const per_page = 5;
        const total_results = Object.keys(data).length;
        const current = page;
        const total_pages = Math.ceil(total_results/per_page);
        const trim_start = (page - 1) * per_page;
        const trim_end = trim_start + per_page;
        const page_lists = data.slice(trim_start, trim_end);
        
        const paginated_data = {
            page_lists: page_lists,
            total_pages: total_pages,
            current_page: current,
            previous_page: current !== 1 ? current - 1 : 0,
            next_page: current !== total_pages ? current + 1 : 0,
            per_page: per_page,
            total_results: total_results,
        };
        
        return paginated_data;
    }
}
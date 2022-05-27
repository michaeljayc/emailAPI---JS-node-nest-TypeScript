import { IResponseFormat } from "src/common/common.interface";
import { SearchService } from "./search.service";
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    search(request: Request, query: any): Promise<IResponseFormat>;
}

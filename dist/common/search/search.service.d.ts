import * as r from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";
export declare class SearchService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    search(table: string, keyword: string, reference: string): Promise<r.WriteResult>;
}

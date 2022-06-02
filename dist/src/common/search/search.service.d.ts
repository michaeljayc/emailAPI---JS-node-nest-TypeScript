import * as r from "rethinkdbdash";
export declare class SearchService {
    private connection;
    constructor(connection: any);
    search(keyword: string, reference: string): Promise<r.WriteResult>;
}

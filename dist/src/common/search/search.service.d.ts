import * as r from "rethinkdb";
export declare class SearchService {
    private connection;
    constructor(connection: any);
    search(keyword: string, reference: string): Promise<r.WriteResult>;
}

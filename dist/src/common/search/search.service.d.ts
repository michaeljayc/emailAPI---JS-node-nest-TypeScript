import * as rethink from "rethinkdb";
export declare class SearchService {
    private connection;
    constructor(connection: any);
    search(keyword: string, reference: string, table: string): Promise<rethink.WriteResult>;
}

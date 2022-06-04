import rethink from "rethinkdbdash";
export declare class DatabaseService {
    r: rethink.Client;
    constructor();
    createDatabase(database: string): Promise<any>;
    listDatabase(): Promise<any>;
    createTable(database: string, tables: string[]): Promise<void | string[]>;
    getById(database: string, table: string, id: string): Promise<any>;
    getByFilter(database: string, table: string, params: any): Promise<any>;
    list(database: string, table: string): Promise<any>;
    insertRecord(database: string, table: string, params: any): Promise<any>;
    updateRecord(database: string, table: string, id: string, params: any): Promise<any>;
    deleteRecord(database: string, table: string, id: string): Promise<any>;
    checkMessageInMenu(database: string, table: string, query: any): Promise<any>;
    search(database: string, table: string, keyword: string, reference: string): Promise<any>;
}

import * as rethink from "rethinkdbdash";
export declare class DatabaseService {
    r: rethink.Client;
    constructor();
    onModuleInit(): void;
    getById(database: string, table: string, id: string): Promise<any>;
    getByFilter(database: string, table: string, params: any): Promise<any>;
    list(database: string, table: string): Promise<any>;
    insertRecord(database: string, table: string, params: any): Promise<any>;
    updateRecord(database: string, table: string, id: string, params: any): Promise<any>;
    deleteRecord(database: string, table: string, id: string): Promise<any>;
}

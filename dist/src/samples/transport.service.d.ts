import { Transport } from './transport.entity';
import * as rethink from 'rethinkdb';
export declare class TransportService {
    private connection;
    constructor(connection: any);
    getData(id: string): Promise<Transport>;
    getList(query: any): Promise<any>;
    insert(data: object): Promise<rethink.WriteResult>;
    update(id: string, data: object): Promise<any>;
    delete(id: string): Promise<rethink.WriteResult>;
    getReports(dates: any): Promise<any>;
}

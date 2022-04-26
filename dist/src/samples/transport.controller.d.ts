import { TransportService } from './transport.service';
import { Transport } from './transport.entity';
export declare class TransportController {
    private readonly transportService;
    constructor(transportService: TransportService);
    list(query: any): Promise<object>;
    add(transport: Transport): Promise<string>;
    edit(id: string): Promise<Transport>;
    update(id: string, transport: Transport): Promise<string>;
    delete(id: string): Promise<string>;
    reports(query: any): Promise<object>;
    search(): Promise<object>;
}

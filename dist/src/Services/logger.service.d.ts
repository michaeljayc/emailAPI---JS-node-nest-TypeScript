import { TLogs } from "../common/common.types";
export declare class LoggerService {
    private connection;
    constructor(connection: any);
    insertLogs(log: TLogs): Promise<any>;
}
export default LoggerService;

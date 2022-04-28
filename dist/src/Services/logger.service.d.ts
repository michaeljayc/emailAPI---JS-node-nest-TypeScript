import { Logs } from "../common/common";
export declare class LoggerService {
    private connection;
    constructor(connection: any);
    insertLogs(log: Logs): Promise<any>;
}
export default LoggerService;

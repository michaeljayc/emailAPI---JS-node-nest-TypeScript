import { TLogs } from "../common/common.types";
export declare class LoggerService {
    constructor();
    insertLogs(log: TLogs): Promise<void>;
}
export default LoggerService;

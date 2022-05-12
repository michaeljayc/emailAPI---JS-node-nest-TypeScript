import { IResponseFormat } from "./common.interface";
export declare type TLogs = {
    timestamp: string;
    request: {
        function_name: string;
        params: {};
    };
    response: IResponseFormat;
};

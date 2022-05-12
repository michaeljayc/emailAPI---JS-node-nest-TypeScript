import { IResponseFormat } from "./common.interface";

export type TLogs = {
    timestamp: string;
    request: {
        function_name: string,
        params: {}
    };
    response: IResponseFormat;
}
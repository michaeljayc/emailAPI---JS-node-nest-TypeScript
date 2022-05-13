import { IResponseFormat } from "./common.interface";
import { TLogs } from "./common.types";
export declare const setDateTime: () => string;
export declare const formatResponse: (data?: any, isSuccessful?: boolean, status?: string) => IResponseFormat;
export declare const formatLogs: (func_name: string, data: object, response: IResponseFormat) => TLogs;
export declare const hidePasswordProperty: (user_data: any) => void;

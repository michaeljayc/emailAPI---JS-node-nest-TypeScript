import { IResponseFormat } from "./common.interface";
import { TLogs } from "./common.types";

const DATE = new Date();

export const setDateTime = () => 
    DATE.toLocaleDateString()+' - '+DATE.toLocaleTimeString();

export const formatResponse = (data?: any,
    isSuccessful?: boolean, 
    status?: string)
    : IResponseFormat => {
        
        let truncated_data = data ?? [];

        if (!truncated_data) {
            truncated_data.map( value => {
                return value
            })
        }

        return {
            count: truncated_data.length ?? 1,
            success: isSuccessful ?? false,
            message: status ?? "Failed",
            datas: truncated_data
        }
}

export const formatLogs = (
        func_name: string, 
        data: object,
        response: IResponseFormat
    ): TLogs => ({
        
        timestamp: DATE.toLocaleDateString()+' '+DATE.toLocaleTimeString(),
        request: {
            function_name: func_name,
            params: data
        },
        response: response
})
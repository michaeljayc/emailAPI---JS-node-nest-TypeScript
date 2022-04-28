import User from "src/users/user.entity";

const DATE = new Date;

export type loginCredentials = {
    email: string;
    password: string;
}

export const setDateTime = () => {
    return DATE.toLocaleDateString()+' - '+DATE.toLocaleTimeString();
}

export class ResponseFormat {

    success: boolean;
    message: string;
    count: number;
    data: User;

    constructor(){}
}

export const formatResponse = (data?: User): ResponseFormat => {
    const response = new ResponseFormat();
    response.count = Object.keys(data).length;
    response.success = true;
    response.message = "Success"
    response.data = data;

    return response;
}

export type Logs = {
    timestamp: string;
    request: {
        function_name: string,
        params: {}
    };
    response: ResponseFormat;
}

export const formatLogs = (func_name: string, data: object,response: ResponseFormat): Logs => {
    return  {
        timestamp: DATE.toLocaleDateString()+' '+DATE.toLocaleTimeString(),
        request: {
            function_name: func_name,
            params: data
        },
        response: response 
    }
}
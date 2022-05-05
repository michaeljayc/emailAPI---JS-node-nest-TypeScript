import { userInfo } from "os";
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
    data?: User[];

    constructor(){}
}

export const formatResponse = (data?: any, success?: boolean, message?: string): ResponseFormat => {
    const truncated_data = data ? data : null;

    if (truncated_data !== null) {
        truncated_data.forEach( value => {
            delete value.password;
        })        
    }

    const response = new ResponseFormat();
    response.count = Object.keys(data).length;
    response.success = success ? success : false;
    response.message = message ? message : "Failed";
    response.data = truncated_data;

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

export const formatLogs = (
        func_name: string, 
        data: object,
        response: ResponseFormat
    ): Logs => {

    return  {
        timestamp: DATE.toLocaleDateString()+' '+DATE.toLocaleTimeString(),
        request: {
            function_name: func_name,
            params: data
        },
        response: response
    }
}

export const truncatePassword = (user:User): User => {
    console.log(user);
    return user;
}
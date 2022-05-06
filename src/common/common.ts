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

export interface ResponseFormat {

    success: boolean;
    message: string;
    count: number;
    datas?: any;
}

export const formatResponse = (data?: any, isSuccessful?: boolean, status?: string): ResponseFormat => {
    let truncated_data = data ? data : null;

    if (truncated_data !== null) {
        truncated_data.forEach( value => {
            delete value.password;
        })        
    }

    const response = {
        count: Object.keys(data).length,
        success: (isSuccessful) ? isSuccessful : false,
        message: (status) ? status : "Failed",
        datas: truncated_data
    }

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

export const Menu =  {
    "inbox": 1,
    "sent": 2,
    "drafts": 3,
    "starred": 4,
    "important": 5
}

export const menu_tables = ["inbox","sent","drafts"];

export const is_valid_menu_tables = (menu: string): boolean => {  
    return menu_tables.includes(menu);
}   

export const is_valid_menu = (menu: string) => {
    const menu_keys = Object.keys(Menu);
    return menu_keys.includes(menu);
}


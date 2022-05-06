import User from "src/users/user.entity";
export declare type loginCredentials = {
    email: string;
    password: string;
};
export declare const setDateTime: () => string;
export interface ResponseFormat {
    success: boolean;
    message: string;
    count: number;
    datas?: any;
}
export declare const formatResponse: (data?: any, isSuccessful?: boolean, status?: string) => ResponseFormat;
export declare type Logs = {
    timestamp: string;
    request: {
        function_name: string;
        params: {};
    };
    response: ResponseFormat;
};
export declare const formatLogs: (func_name: string, data: object, response: ResponseFormat) => Logs;
export declare const truncatePassword: (user: User) => User;
export declare const Menu: {
    inbox: number;
    sent: number;
    drafts: number;
    starred: number;
    important: number;
};
export declare const menu_tables: string[];
export declare const is_valid_menu_tables: (menu: string) => boolean;
export declare const is_valid_menu: (menu: string) => boolean;

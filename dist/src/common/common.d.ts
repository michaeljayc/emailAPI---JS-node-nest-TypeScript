import User from "src/users/user.entity";
export declare type loginCredentials = {
    email: string;
    password: string;
};
export declare const setDateTime: () => string;
export declare class ResponseFormat {
    success: boolean;
    message: string;
    count: number;
    data?: User[];
    constructor();
}
export declare const formatResponse: (data?: User[], success?: boolean, message?: string) => ResponseFormat;
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

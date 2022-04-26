import User from "src/Entities/user.entity";
export declare type LoginCredentials = {
    email: string;
    password: string;
};
export declare const setDateTime: () => string;
export declare class ResponseFormat {
    success: boolean;
    message: string;
    count: number;
    data: {};
    constructor();
}
export declare const formatResponse: (user: User) => ResponseFormat;

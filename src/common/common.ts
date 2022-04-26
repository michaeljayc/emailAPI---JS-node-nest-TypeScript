import User from "src/Entities/user.entity";

const d = new Date();

export type LoginCredentials = {
    email: string;
    password: string;
}

export const setDateTime = () => {
    return d.toLocaleDateString()+' - '+d.toLocaleTimeString();
}

export class ResponseFormat {

    success: boolean;
    message: string;
    count: number;
    data: {};

    constructor(){}
}

export const formatResponse = (user: User): ResponseFormat => {
    const response = new ResponseFormat();
    response.count = Object.keys(user).length;
    response.success = true;
    response.message = "Success"
    response.data = user;

    return response;
}
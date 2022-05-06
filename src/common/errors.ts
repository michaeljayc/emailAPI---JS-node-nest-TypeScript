import { ResponseFormat } from "./common";
import { User } from "src/users/user.entity";
import { BadRequestException } from "@nestjs/common";

export const userEmailDoesNotExist = (email: string) => {
    let status = `${email} does not exist.`;
    
    const response = {
        success: false,
        count: 0,
        message: status,
        data: null,
    }

    return response;
}

export const incorrectUserPassword = () => {
    let status = "Incorrect Password.";

    const response = {
        success: false,
        count: 0,
        message: status,
        data: null,
    }

    return response;
}
import { ResponseFormat } from "./common";
import { User } from "src/users/user.entity";
import { BadRequestException } from "@nestjs/common";

export const userEmailDoesNotExist = (email: string) => {
    let message = `${email} does not exist.`;
    const response = new ResponseFormat();
    response.success = false;
    response.count = 0;
    response.message = message;
    response.data = null;
    return response;
}

export const incorrectUserPassword = () => {
    let message = "Incorrect Password.";
    const response = new ResponseFormat();
    response.success = false;
    response.count = 0;
    response.message = message;
    response.data = null;
    return response;
}
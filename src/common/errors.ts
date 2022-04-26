import { ResponseFormat } from "./common";
const error = new Error();

export const userEmailDoesNotExist = (email: string) => {
    let message = `${email} does not exist.`;
    const response = new ResponseFormat();
    response.success = false;
    response.count = 0;
    response.message = message;
    response.data = {}
    return response;
}

export const incorrectUserPassword = () => {
    let message = "Incorrect Password.";
    const response = new ResponseFormat();
    response.success = false;
    response.count = 0;
    response.message = message;
    response.data = {}
    return response;
}
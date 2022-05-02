export class Message {

    id: string;
    sender: string; //user email
    recipient: string;
    subject: string;
    message: string;
    menu_state: number;
    isDraft: boolean;
    isDeleted: boolean;

    constructor(id: string,
        sender: string,
        recipient: string,
        subject: string,
        message: string,
        menu_state: number,
        isDraft: boolean,
        isDeleted: boolean,){}
}

export default Message;
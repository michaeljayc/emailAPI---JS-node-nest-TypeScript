export class Message {

    id: string;
    user_id: string;
    sender: string; //user email
    recipient: string;
    subject: string;
    message: string;
    menu_state: number;
    isDraft: boolean;
    isDeleted: boolean;
    read: false;
    unread: true;
    created_date: string;
    updated_date: string;

    constructor(id: string,
        user_id, string,
        sender: string,
        recipient: string,
        subject: string,
        message: string,
        menu_state: number,
        isDraft: boolean,
        isDeleted: boolean,
        read: false,
        unread: true,
        created_date: Date,
        updated_date: Date){}
}

export default Message;
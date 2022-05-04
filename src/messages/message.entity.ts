export class Message {

    id: string;
    sender: string; //user email
    sender_id: string;
    recipient: string;
    recipient_id: string
    subject: string;
    message: string;
    menu_state: number;
    isDeleted: boolean;
    read: false;
    unread: true;
    created_date: string;
    updated_date: string;

    constructor(id: string,
        sender: string,
        sender_id: string,
        recipient: string,
        recipient_id: string,
        subject: string,
        message: string,
        menu_state: number,
        isDeleted: boolean,
        read: false,
        unread: true,
        created_date: string,
        updated_date: string){}
}

export default Message;
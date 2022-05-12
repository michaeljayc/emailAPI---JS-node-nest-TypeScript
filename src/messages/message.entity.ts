export class Message {

    id: string;
    message_origin_id: string;
    sender: string; //user email
    sender_id: string;
    recipient: string;
    recipient_id: string
    subject: string;
    message: string;
    menu_state: number;
    read: boolean;
    drafted: boolean;
    created_date: string;
    updated_date: string;

    constructor(id: string,
        message_origin_id: string,
        sender: string,
        sender_id: string,
        recipient: string,
        recipient_id: string,
        subject: string,
        message: string,
        menu_state: number,
        read: false,
        drafted: false,
        created_date: string,
        updated_date: string){}
}

export default Message;
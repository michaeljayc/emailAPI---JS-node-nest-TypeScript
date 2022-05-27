export class Message {

    uuid: string;
    message_origin_id: string;
    sender: string;
    recipient: string;
    subject: string;
    message: string;
    status: number;
    read: boolean;
    drafted: boolean;
    created_date: string;
    updated_date: string;

    constructor(uuid: string,
        message_origin_id: string,
        sender: string,
        recipient: string,
        subject: string,
        message: string,
        status: number,
        read: false,
        drafted: false,
        created_date: string,
        updated_date: string){}
}

export default Message;
export declare class Message {
    id: string;
    message_origin_id: string;
    sender: string;
    sender_id: string;
    recipient: string;
    recipient_id: string;
    subject: string;
    message: string;
    menu_state: number;
    read: false;
    unread: true;
    created_date: string;
    updated_date: string;
    constructor(id: string, message_origin_id: string, sender: string, sender_id: string, recipient: string, recipient_id: string, subject: string, message: string, menu_state: number, read: false, unread: true, created_date: string, updated_date: string);
}
export default Message;

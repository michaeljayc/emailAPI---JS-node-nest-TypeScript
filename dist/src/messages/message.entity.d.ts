export declare class Message {
    uuid: string;
    message_origin_id: string;
    sender: {
        email: string;
        menu: number;
    };
    recipient: {
        email: string;
        menu: number;
    };
    subject: string;
    message: string;
    status: number;
    created_date: string;
    updated_date: string;
    constructor(uuid: string, message_origin_id: string, sender: {
        email: string;
        menu: number;
    }, recipient: {
        email: string;
        menu: number;
    }, subject: string, message: string, status: number, created_date: string, updated_date: string);
}
export default Message;

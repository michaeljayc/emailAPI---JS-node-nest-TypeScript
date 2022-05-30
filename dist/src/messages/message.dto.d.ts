export declare class EmailReference {
    email: String;
    menu: Number;
}
export declare class NewMessageDTO {
    constructor();
    sender: EmailReference;
    recipient: EmailReference;
    uuid: string;
    message_origin_id: string;
    subject: string;
    message: string;
    status: number;
    created_date: string;
    updated_date: string;
}

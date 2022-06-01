export declare class EmailReference {
    email: string;
    menu: number;
}
export declare class NewMessageDTO {
    constructor();
    sender: EmailReference;
    recipient: EmailReference;
    id: string;
    message_origin_id: string;
    subject: string;
    message: string;
    status: number;
    created_date: string;
    updated_date: string;
}

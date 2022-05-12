export interface ISendingMessageFormat {
    recipient: string;
    subject: string;
    message: string;
}

export interface IReplyMessageFormat {
    recipient: string;
    recipient_id: string;
    sender: string;
    sender_id: string;
    subject: string;
    message: string;
    message_origin_id: string;
}
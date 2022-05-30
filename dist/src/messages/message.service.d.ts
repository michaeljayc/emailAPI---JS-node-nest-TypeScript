import * as rethink from "rethinkdb";
import Message from "./message.entity";
export declare class MessageService {
    private connection;
    constructor(connection: any);
    getMessageById(id: string): Promise<Message>;
    getMessages(data: any): Promise<rethink.WriteResult>;
    getMessageDetails(message_id: string): Promise<any>;
    sendMessage(message: Message): Promise<rethink.WriteResult>;
    updateReadUnread(message_id: string): Promise<any>;
    updateMessage(id: string, message?: Message): Promise<rethink.WriteResult>;
    deleteMessage(message_id: string): Promise<rethink.WriteResult>;
}
export default MessageService;

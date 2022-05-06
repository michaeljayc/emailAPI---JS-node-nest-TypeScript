import * as rethink from "rethinkdb";
import Message from "./message.entity";
export declare class MessageService {
    private connection;
    constructor(connection: any);
    getMessages(data: any): Promise<rethink.WriteResult>;
    getMessageDetails(table: string, message_id: string): Promise<any>;
    sendMessage(table: string, message: Message): Promise<rethink.WriteResult>;
    updateReadUnread(message: Message): Promise<any>;
    updateMessage(table: string, id: string, message: Message): Promise<rethink.WriteResult>;
    deleteMessage(table: string, message_id: string): Promise<rethink.WriteResult>;
}
export default MessageService;

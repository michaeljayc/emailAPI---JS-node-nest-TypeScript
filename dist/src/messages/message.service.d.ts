import * as rethink from "rethinkdbdash";
import Message from "./message.entity";
import { TFilteredQuery } from "./message.interface";
export declare class MessageService {
    private rethink;
    constructor(rethink: any);
    getMessageById(id: string): Promise<Message>;
    getMessages(data: TFilteredQuery): Promise<rethink.WriteResult>;
    getMessageDetails(filtered: TFilteredQuery): Promise<rethink.WriteResult>;
    sendMessage(message: Message): Promise<rethink.WriteResult>;
    updateReadUnread(message_id: string): Promise<any>;
    updateMessage(id: string, message?: Message): Promise<rethink.WriteResult>;
    deleteMessage(message_id: string): Promise<rethink.WriteResult>;
    checkMessageInMenu(query: any): Promise<rethink.WriteResult>;
}
export default MessageService;

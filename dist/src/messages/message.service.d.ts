import * as rethink from "rethinkdb";
import Message from "./message.entity";
export declare class MessageService {
    private connection;
    constructor(connection: any);
    getMessages(id: string, menu?: number | string): Promise<rethink.WriteResult>;
    getMessageDetails(message_id: string): Promise<any>;
    createMessage(message: Message): Promise<any>;
}
export default MessageService;

import { Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdb";
import { setDateTime } from "src/common/common.functions";
import { MENU, STATE } from "./message.common";
import Message from "./message.entity";

const DB = "emailAPI";
const TABLE = "messages";
@Injectable()
export class MessageService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection,) {
        this.connection = connection;
    }

    async getMessageById(id: string): Promise<Message> {
        return rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            .run(this.connection)
    }

    async getMessages(data: any): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(data)
            .orderBy('updated_date')
            .run(this.connection)
    }

    async getMessageDetails(message_id: string)
        : Promise<any> {
            return rethink
                .db(DB)
                .table(TABLE)
                .get(message_id)
                .run(this.connection)
    }

    async sendMessage(message: Message)
        : Promise<rethink.WriteResult> {
            return rethink
                .db(DB)
                .table(TABLE)
                .insert(message)
                .run(this.connection)
    }

    async updateReadUnread(message_id: string)
        : Promise<any> {

            await rethink
                .db(DB)
                .table(TABLE)
                .get(message_id)
                .update({
                    "status": STATE.read,
                    "updated_date": setDateTime() 
                })
                .run(this.connection)

            return await this.getMessageDetails(message_id);
    }


    async updateMessage(id:string,
        message?: Message)
        : Promise<rethink.WriteResult> {
            return rethink
                .db(DB)
                .table(TABLE)
                .get(id)
                .update(message)
                .run(this.connection)
    }

    async deleteMessage(message_id: string)
        : Promise<rethink.WriteResult> {
            await rethink
                .db(DB)
                .table(TABLE)
                .get(message_id)
                .delete()
                .run(this.connection)

            return this.getMessageById(message_id);
    }
    
}

export default MessageService;
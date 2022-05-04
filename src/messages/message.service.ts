import { Inject, Injectable } from "@nestjs/common";
import { WriteVResult } from "fs";
import * as rethink from "rethinkdb";
import Message from "./message.entity";

const DB = "emailAPI";
const TABLE = "messages";
@Injectable()
export class MessageService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection) {
        this.connection = connection;
    }

    async getReceivedMessages(id: string)
        : Promise<rethink.WriteResult> {
            return await rethink
                .db(DB)
                .table("inbox")
                .filter({
                    "recipient_id": id
                })
                .orderBy('updated_date')
                .run(this.connection)
    }

    async getComposedMessages(id: string,table:string)
        : Promise<rethink.WriteResult> {
            let table_to_query = table === "sent" ? "sent" : "drafts"; 
            return await rethink
                .db(DB)
                .table(table_to_query)
                .filter({
                    "sender_id": id
                })
                .orderBy('updated_date')
                .run(this.connection)
    }

    async getMessageDetails(table: string, message_id: string)
        : Promise<any> {
            return await rethink
                .db(DB)
                .table(table)
                .get(message_id)
                .run(this.connection)
    }

    async sendMessage(table: string, message: Message)
        : Promise<rethink.WriteResult> {
            return await rethink
                .db(DB)
                .table(table)
                .insert(message)
                .run(this.connection)
    }

    async updateReadUnread(message: Message)
        : Promise<any> {
            let res = await rethink
                .db(DB)
                .table("inbox")
                .get(message.id)
                .update(
                    {   
                        "read": true,
                        "unread": false,
                        "updated_date": String(Date.now())
                    },
                    
                )
                .run(this.connection)

            return await this.getMessageDetails("inbox", message.id);
    }


    async updateMessage(id:string, message: Message)
        : Promise<rethink.WriteResult> {
            return await rethink
                .db(DB)
                .table("drafts")
                .get(id)
                .update(message)
                .run(this.connection)
    }

    async deleteMessage(table: string, message_id: string)
        : Promise<rethink.WriteResult> {

            return await rethink
                .db(DB)
                .table(table)
                .get(message_id)
                .delete()
                .run(this.connection)
    }
    
    
}

export default MessageService;
import { Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdb";
import { setDateTime } from "src/common/common.functions";
import { STATE } from "./message.common";
import Message from "./message.entity";
import { TFilteredQuery } from "./message.interface";

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

    async getMessages(data: TFilteredQuery): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(data)
            .orderBy('updated_date')
            .run(this.connection)
    }

    async getMessageDetails(filtered: TFilteredQuery)
        : Promise<rethink.WriteResult> {
            return rethink
                .db(DB)
                .table(TABLE)
                .filter(filtered)
                .run(this.connection)
    }

    async sendMessage(message: Message)
        : Promise<rethink.WriteResult> {
            return rethink
                .db(DB)
                .table(TABLE)
                .insert(
                    message,
                    {returnChanges: true}
                )
                .run(this.connection)
    }

    async updateReadUnread(message_id: string)
        : Promise<any> {

            return await rethink
                .db(DB)
                .table(TABLE)
                .get(message_id)
                .update({
                    "status": STATE.read,
                    "updated_date": setDateTime() 
                    }, 
                    {returnChanges: "always"}
                )
                .run(this.connection)
    }

    async updateMessage(id:string,
        message?: Message)
        : Promise<rethink.WriteResult> {
            return rethink
                .db(DB)
                .table(TABLE)
                .get(id)
                .update(
                    message,
                    {returnChanges: "always"}
                )
                .run(this.connection)
    }

    async deleteMessage(message_id: string)
        : Promise<rethink.WriteResult> {
            await rethink
                .db(DB)
                .table(TABLE)
                .get(message_id)
                .delete({returnChanges: "always"})
                .run(this.connection)
    }
}

export default MessageService;
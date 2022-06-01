import { Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdb";
import { filter } from "rxjs";
import { setDateTime } from "src/common/common.functions";
import { MENU, STATE } from "./message.common";
import { NewMessageDTO } from "./message.dto";
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
        console.log(data)
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(data)
            .orderBy('updated_date')
            .run(this.connection)
    }

    async getMessageDetails(message_id: string,
        filtered?: any)
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
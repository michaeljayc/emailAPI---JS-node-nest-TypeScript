import { Inject, Injectable } from "@nestjs/common";
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

    async getMessages(id: string, menu?: number | string): Promise<rethink.WriteResult> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .filter({
                "user_id":id,
                "menu_state": menu
            })
            .orderBy('updated_date')
            .run(this.connection)
    }

    async getMessageDetails(message_id: string): Promise<any> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .get(message_id)
            .run(this.connection)
    }

    async createMessage(message: Message): Promise<any> {
        return await rethink
            .db(DB)
            .table(TABLE)
            .insert(message)
            .run(this.connection)
    }
}

export default MessageService;
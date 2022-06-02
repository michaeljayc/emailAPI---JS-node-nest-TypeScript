import { Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdbdash";
import { setDateTime } from "src/common/common.functions";
import { DatabaseService } from "src/database/database.service";
import { STATE } from "./message.common";
import Message from "./message.entity";
import { TFilteredQuery } from "./message.interface";

const {HOST='localhost', PORT="28015"} = process.env
const DB = "emailAPI";
const TABLE = "messages";
@Injectable()
export class MessageService {
    private rethink: rethink.Connection;
    constructor(private databaseService: DatabaseService) {}

    async getMessageById(id: string): Promise<Message> {
        return this.rethink
            .db(DB)
            .table(TABLE)
            .get(id)
            
    }

    async getMessages(data: TFilteredQuery): Promise<rethink.WriteResult> {
        return rethink
            .db(DB)
            .table(TABLE)
            .filter(data)
            .orderBy('updated_date')
            
    }

    async getMessageDetails(filtered: TFilteredQuery)
        : Promise<rethink.WriteResult> {
            return rethink
                .db(DB)
                .table(TABLE)
                .filter(filtered)
                
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
                
    }

    async deleteMessage(message_id: string)
        : Promise<rethink.WriteResult> {
            await rethink
                .db(DB)
                .table(TABLE)
                .get(message_id)
                .delete({returnChanges: "always"})
                
    }

    async checkMessageInMenu(query: any)
        : Promise<rethink.WriteResult> {
            
            return rethink
                .db(DB)
                .table(TABLE)
                .filter(
                    rethink.row('id').eq(query.id).and
                        (rethink.row('recipient')('email').eq(query.reference).and
                        (rethink.row('recipient')('menu').eq(query.menu)).or
                            (rethink.row('sender')('email').eq(query.reference).and
                            (rethink.row('sender')('menu').eq(query.menu))))
                )
                
    }
}

export default MessageService;
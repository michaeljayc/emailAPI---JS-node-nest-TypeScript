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

    async getMessages(data: any)
        : Promise<rethink.WriteResult> {
            
            try {
                return rethink
                .db(DB)
                .table(data.menu)
                .filter(data.filtered)
                .orderBy('updated_date')
                .run(this.connection)
            } catch (error) {
                throw new Error(error)
            }
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

    async updateReadUnread(message_id: string)
        : Promise<any> {

            let res = await rethink
                .db(DB)
                .table("inbox")
                .get(message_id)
                .update(
                    {   
                        "read": true,
                        "updated_date": String(Date.now())
                    },
                    
                )
                .run(this.connection)

            return await this.getMessageDetails("inbox", message_id);
    }


    async updateMessage(table: string, 
        id:string,
         message: Message)
        : Promise<rethink.WriteResult> {

            return await rethink
                .db(DB)
                .table(table)
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
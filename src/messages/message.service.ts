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
        return this.databaseService.getById(DB, TABLE, id)
            
    }

    async getMessages(data: TFilteredQuery): Promise<rethink.WriteResult> {
        return this.databaseService.getByFilter(DB, TABLE, data);
            
    }

    async getMessageDetails(filtered: TFilteredQuery)
    : Promise<rethink.WriteResult> {
            return this.databaseService.getByFilter(DB, TABLE, filtered)
    }

    async sendMessage(message: Message)
        : Promise<rethink.WriteResult> {
            return this.databaseService.insertRecord(DB, TABLE, message);    
    }

    async updateReadUnread(message_id: string, data: Message)
        : Promise<any> {
            return this.databaseService.updateRecord(DB, TABLE, message_id, data)       
    }

    async updateMessage(id:string,
        message?: Message)
        : Promise<rethink.WriteResult> {
            return this.databaseService.updateRecord(DB, TABLE, id, message);
                
    }

    async deleteMessage(message_id: string)
        : Promise<rethink.WriteResult> {
            await this.databaseService.deleteRecord(DB, TABLE, message_id);
                
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
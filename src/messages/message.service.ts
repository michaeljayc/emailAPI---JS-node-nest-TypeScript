import { Injectable } from "@nestjs/common";
import * as rethink from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";
import Message from "./message.entity";
import { TFilteredQuery } from "./message.interface";

const DB = "emailAPI";
const TABLE = "messages";
@Injectable()
export class MessageService {

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
            return this.databaseService.deleteRecord(DB, TABLE, message_id);
                
    }

    async checkMessageInMenu(query: any)
        : Promise<rethink.WriteResult> {
            return this.databaseService.checkMessageInMenu(DB, TABLE, query);
        }
}

export default MessageService;
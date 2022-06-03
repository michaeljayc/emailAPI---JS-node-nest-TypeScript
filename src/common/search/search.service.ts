import { Injectable, Inject} from "@nestjs/common";
import { timeStamp } from "console";
import * as r from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";

const DB = "emailAPI";

@Injectable()
export class SearchService {

    constructor(private databaseService: DatabaseService) {}

    async search(table: string, keyword:string, reference: string)
        : Promise<r.WriteResult> {
            keyword = keyword.toLocaleLowerCase();
            return this.databaseService.search(DB, table, keyword, reference);
    }
}
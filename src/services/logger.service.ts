import { Injectable } from "@nestjs/common";
import * as rethink from "rethinkdbdash";
import { DatabaseService } from "src/database/database.service";
import { TLogs } from "../common/common.types";
const DB = "emailAPI";
const TABLE = "logs";

@Injectable()
export class LoggerService {

    constructor() {}

    async insertLogs(log: TLogs) {
        // return await r
        //     .db(DB)
        //     .table(TABLE)
        //     .insert(log)
    }
}

export default LoggerService;
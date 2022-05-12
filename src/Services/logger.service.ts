import { ConsoleLogger, Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdb";
import { TLogs } from "../common/common.types";

const DB = "emailAPI";
const TABLE = "logs";

@Injectable()
export class LoggerService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection) {
        this.connection = connection;
    }

    async insertLogs(log: TLogs) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .insert(log)
            .run(this.connection)
    }
}

export default LoggerService;
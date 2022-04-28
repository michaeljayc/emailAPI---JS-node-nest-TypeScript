import { ConsoleLogger, Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdb";
import { Logs } from "../common/common";

const DB = "emailAPI";
const TABLE = "logs";

@Injectable()
export class LoggerService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection) {
        this.connection = connection;
    }

    async insertLogs(log: Logs) {
        return await rethink
            .db(DB)
            .table(TABLE)
            .insert(log)
            .run(this.connection)
    }
}

export default LoggerService;
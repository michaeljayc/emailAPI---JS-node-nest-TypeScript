import { ConsoleLogger, Inject, Injectable } from "@nestjs/common";
import * as rethink from "rethinkdbdash";
import { TLogs } from "../common/common.types";
const DB = "emailAPI";
const TABLE = "logs";

@Injectable()
export class LoggerService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection) {
        this.connection = RethinkProvider.useFactory();
    }

    async insertLogs(log: TLogs) {
        return await this.connection
            .db(DB)
            .table(TABLE)
            .insert(log)
    }
}

export default LoggerService;
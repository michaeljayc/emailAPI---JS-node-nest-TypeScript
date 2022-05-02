import { Inject, Injectable } from "@nestjs/common";
import rethink from "rethinkdb";

@Injectable()
export class MessageService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection) {
        this.connection = connection;
    }
}

export default MessageService;
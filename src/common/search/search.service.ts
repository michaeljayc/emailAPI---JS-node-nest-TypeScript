import { Injectable, Inject} from "@nestjs/common";
import * as r from "rethinkdb";

const DB = "emailAPI";

@Injectable()
export class SearchService {

    private connection: r.Connection;

    constructor(@Inject("RethinkProvider") connection,) {
        this.connection = connection;
    }

    async search(keyword:string, reference: string)
        : Promise<r.WriteResult> {

            keyword = keyword.toLocaleLowerCase();
            return await r
                .db(DB)
                .table("messages")
                .filter(
                  r.row('recipient')('email').eq(reference).or
                  (r.row('sender')('email').eq(reference)).and
                    (r.row('subject').match(keyword).or
                    (r.row('message').match(keyword)))
                )
                .run(this.connection)
    }
}
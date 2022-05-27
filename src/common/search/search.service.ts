import { Injectable, Inject} from "@nestjs/common";
import * as rethink from "rethinkdb";

const DB = "emailAPI";

@Injectable()
export class SearchService {

    private connection: rethink.Connection;

    constructor(@Inject("RethinkProvider") connection,) {
        this.connection = connection;
    }

    async search(keyword:string, reference: string,
        table: string)
        : Promise<rethink.WriteResult> {

            keyword = keyword.toLocaleLowerCase();
            return rethink  
                .db(DB)
                .table(table)
                .filter(
                    function(item) {
                        return item("recipient").eq(reference)
                            .and(item("subject").match(keyword)
                                .or(item("sender").match(keyword)
                                .or(item("message").match(keyword)))
                            )
                    }
                )
                .run(this.connection)
    }
}
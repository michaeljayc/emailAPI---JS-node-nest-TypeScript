import { Injectable, Logger } from "@nestjs/common";
import rethink from "rethinkdbdash";
import bluebird from "bluebird"
const logger = new Logger('DB:SERVICE:RETHINK');
require('dotenv').config();

const {HOST,PORT} = process.env;

@Injectable()
export class DatabaseService {

  r: rethink.Client;
  constructor() {
    this.r = rethink({
      host: HOST,
      port: Number(PORT),
    } as rethink.ConnectOptions);
  }

  async createDatabase(database: string) {
    try {
      const dbLists = await this.listDatabase();
      if (dbLists.includes("emailAPI"))
        return; 
      return this.r.dbCreate(database)
    } catch (error) {
      logger.log(error);
      return
    }
  }

  async listDatabase() {
    return this.r.dbList();
  }

  async createTable(database: string, tables: string[]) {
    try {
        return await bluebird.each( tables, async(table) => {
          await this.r.db(database).tableCreate(table)
        })
    } catch (error) {
      return logger.log(error)
    }
  }

  async getById(database: string, table: string, id: string) {
    return this.r.db(database).table(table).get(id);
  }

  async getByFilter(database: string, table: string, params: any,) {
    return this.r.db(database).table(table).filter(params);
  }

  async list(database: string, table: string) {
    return this.r.db(database).table(table);
  }

  async insertRecord(database: string, table: string, params: any) {
    try {
      return await this.r.db(database).table(table).insert(
        params,
        {returnChanges: "always"}
      )
    } catch (error) {
      return logger.warn(error)
    }
  }

  async updateRecord(database: string, table: string, id: string, params: any) {
    return this.r.db(database).table(table).get(id).update(
        params,
        {returnChanges: "always"}
      )
}

  async deleteRecord(database: string, table: string, id: string) {
    return this.r
      .db(database)
      .table(table)
      .get(id)
      .delete({returnChanges: "always"})
  }

  async checkMessageInMenu(database: string, table: string, query: any) {
    if (query.id)
      return this.r.db(database).table(table).filter(
            function(item) {
              return item('id').eq(query.id).and
                (item('recipient')('email').eq(query.reference).and
                (item('recipient')('menu').eq(query.menu)).or
                  (item('sender')('email').eq(query.reference).and
                  (item('sender')('menu').eq(query.menu))))
            }
        )
    
    return this.r.db(database).table(table).filter(
      function(item) {
        return item('recipient')('email').eq(query.reference).and
          (item('recipient')('menu').eq(query.menu)).or
            (item('sender')('email').eq(query.reference).and
            (item('sender')('menu').eq(query.menu)))
      }
    )
  }

  async search(database: string, table: string, keyword: string, reference: string) {
    if (table === "messages")
      return this.r.db(database).table(table).filter(
        function(item) {
          return item('recipient')('email').eq(reference).or
            (item('sender')('email').eq(reference)).and
              (item('subject').match(keyword).or
              (item('message').match(keyword)))
        }
      )
    
    return this.r.db(database).table(table).filter(
      function(item) {
        return item('email').match(keyword).or
          (item('username').match(keyword)).or
            (item('first_name').match(keyword).or
            (item('last_name').match(keyword)))
      }
    )
  }
}
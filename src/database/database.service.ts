import { Injectable, Logger } from "@nestjs/common";
import * as rethink from "rethinkdbdash";

const logger = new Logger('DB:SERVICE:RETHINK');
require('dotenv').config();

const {
  // database = 'nest_test',
  HOST = 'localhost',
  PORT = '28015',
} = process.env;

@Injectable()
export class DatabaseService {

  r: rethink.Client;
  constructor() {
    this.r = rethink({
      host: HOST,
      port: Number(PORT),
    } as rethink.ConnectOptions);
  }

  onModuleInit() {
    logger.log(`Successfully Initialized Rethink Service`);
  }

  async getById(database: string, table: string, id: string) {
    return this.r.db(database).table(table).get(id);
  }

  async getByFilter(
    database: string,
    table: string,
    params: Record<string, any>,
  ) {
    return this.r.db(database).table(table).filter(params);
  }

  async list(database: string, table: string) {
    return this.r.db(database).table(table);
  }

//   async addRecord(database: string, table: string, params: any) {
//     const new_params = {
//       ...params,
//       ...(params.id ?? { id: v4() }),
//       status: 'Active',
//       created_date: new Date().getTime(),
//       updated_date: new Date().getTime(),
//     };
//     return this.r
//       .db(database)
//       .table(table)
//       .insert(new_params, { returnChanges: true });
//   }

    async insertRecord(database: string, table: string, params: any) {
        return this.r.db(database).table(table).insert(params)
    }

  async deleteRecord(database: string, table: string, id: string) {
    return this.r
      .db(database)
      .table(table)
      .get(id)
      .update({ status: 'Inactive', updated_date: new Date().getTime() });
  }
}
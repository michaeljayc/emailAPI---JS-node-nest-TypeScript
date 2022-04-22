import { Injectable, Inject } from '@nestjs/common';
import { Transport } from './transport.entity';
import * as rethink from 'rethinkdb';

const TABLE = 'daily';

@Injectable()
export class TransportService {
  private connection: rethink.Connection;

  constructor(@Inject('RethinkProvider') connection) {
    this.connection = connection;
  }

  async getData(id: string): Promise<Transport> {
    return await rethink
      .db('testDb')
      .table(TABLE)
      .get(id)
      .run(this.connection)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async getList(query: any): Promise<any> {
    //let current: number = 1;
    let response: any;

    if (Object.keys(query)[0] === 'page') {
      //current = Number(query.page);
      response = await rethink
        .db('testDb')
        .table(TABLE)
        .orderBy('time_start')
        .run(this.connection);
    }

    if (Object.keys(query)[0] === 'search') {
      response = await rethink
        .db('testDb')
        .table(TABLE)
        .filter(rethink.row('reason').eq(`${query.search}`))
        .orderBy('time_start')
        .run(this.connection);
    }

    return response;
  }

  async insert(data: object): Promise<rethink.WriteResult> {
    return await rethink
      .db('testDb')
      .table(TABLE)
      .insert(data)
      .run(this.connection);
  }

  async update(id: string, data: object): Promise<any> {
    return await rethink
      .db('testDb')
      .table(TABLE)
      .get(id)
      .update(data)
      .run(this.connection);
  }

  async delete(id: string): Promise<rethink.WriteResult> {
    if (this.getData(id)) {
      return await rethink
        .db('testDb')
        .table(TABLE)
        .get(id)
        .delete()
        .run(this.connection);
    }
  }

  async getReports(dates: any): Promise<any> {
    return await rethink
      .db('testDb')
      .table(TABLE)
      .filter(
        rethink
          .row('time_end')
          .le(dates.to)
          .and(rethink.row('time_start').ge(dates.from)),
      )
      .orderBy('time_start')
      .run(this.connection);
  }
}

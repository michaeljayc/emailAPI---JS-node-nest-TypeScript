import * as rethink from 'rethinkdb';
require('dotenv').config()
const {HOST} = process.env

export const RethinkProvider = {
  provide: 'RethinkProvider',
  useFactory: async () => {
    const conn = await rethink.connect(HOST);
    return conn;
  },
};


export default RethinkProvider;
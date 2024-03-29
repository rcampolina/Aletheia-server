import knex from 'knex';

const parse = require('pg-connection-string').parse;
const pgconfig = parse(process.env.DB_URI);
pgconfig.ssl = { rejectUnauthorized: false };

const db = knex({
  client: 'postgresql',
  connection: pgconfig,
  useNullAsDefault: true,
});

export default db;
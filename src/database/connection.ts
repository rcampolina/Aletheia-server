import knex from 'knex';

const db = knex({
  client: 'postgresql',
  connection: process.env.DB_URI,
  useNullAsDefault: true,
});

export default db;
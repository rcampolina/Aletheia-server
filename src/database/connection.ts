import knex from 'knex';

const db = knex({
  client: 'postgresql',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1816',
    database: 'Aletheia',
  },
  useNullAsDefault: true,
});

export default db;
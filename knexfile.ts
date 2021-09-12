import path from 'path';

const parse = require('pg-connection-string').parse;
const pgconfig = parse(process.env.DB_URI);
pgconfig.ssl = { rejectUnauthorized: false };

module.exports = {
  client: 'postgresql',
  connection: pgconfig,
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
};
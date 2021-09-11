import path from 'path';

module.exports = {
  client: 'postgresql',
  connection: process.env.DB_URI,
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
};
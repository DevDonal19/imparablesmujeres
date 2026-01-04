const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sharedConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'imparable',
    timezone: 'Z',
    dateStrings: true,
  },
  migrations: {
    directory: path.resolve(__dirname, 'db/migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  },
};

module.exports = sharedConfig;

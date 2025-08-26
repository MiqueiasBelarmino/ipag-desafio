const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    migrations: {
      directory: path.resolve(__dirname, "migrations")
    }
  }
};

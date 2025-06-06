require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'gameuser',
    password: process.env.DB_PASS || 'Duschlampe321',
    database: process.env.DB_NAME || 'partygames',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
};
require('dotenv').config();

const config = {
  server: 'localhost',
  database: 'Management',
  user: process.env.USER,
  password: process.env.PASSWORD,
  options: {
    encrypt: false,
    enableArithAbort: true
  }
}

module.exports = config;
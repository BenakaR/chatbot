const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5433,
  database: 'Chatbot'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
const mysql = require('mysql2');

// Create connection pool (better than single connection)
const pool = mysql.createPool({
  host: 'localhost',    
  user: 'root',          
  password: '',          
  database: 'ehelepola_walawwa',   
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

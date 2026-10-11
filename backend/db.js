const mysql = require('mysql2');
require('dotenv').config();

// creating a connection pool instead of single connection
// this is better for handling multiple requests
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// using promise wrapper so we can use async/await
const db = pool.promise();

module.exports = db;

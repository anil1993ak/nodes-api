const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "nodejs_api",
  waitForConnections: true,
  connectionLimit: 100,
});

let dbReady = false;
let dbInitError = null;

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    dbReady = true;
    dbInitError = null;
  } catch (err) {
    dbInitError = err;
    dbReady = false;
    // Restart pe db aa jaye to service ready ho jayegi.
    console.error("DB init failed:", err.message);
  }
}

function isDbReady() {
  return dbReady;
}

function getDbInitError() {
  return dbInitError;
}

module.exports = { pool, initDatabase, isDbReady, getDbInitError };


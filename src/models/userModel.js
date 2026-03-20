const { pool } = require("../config/db");

async function getAll() {
  const [rows] = await pool.query(
    "SELECT id, name, email, created_at FROM users ORDER BY id DESC"
  );
  return rows;
}

async function create({ name, email }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );

  const [createdRows] = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [result.insertId]
  );

  return createdRows[0];
}

async function getById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function updateById(id, { name, email }) {
  const [result] = await pool.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id]
  );

  if (result.affectedRows === 0) return null;
  return getById(id);
}

async function deleteById(id) {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, create, getById, updateById, deleteById };


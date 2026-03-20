const { pool } = require("../config/db");

async function getAll() {
  const [rows] = await pool.query(
    "SELECT id, name, price, description, created_at FROM products ORDER BY id DESC"
  );
  return rows;
}

async function create({ name, price, description }) {
  const [result] = await pool.query(
    "INSERT INTO products (name, price, description) VALUES (?, ?, ?)",
    [name, price, description || null]
  );

  const [createdRows] = await pool.query(
    "SELECT id, name, price, description, created_at FROM products WHERE id = ?",
    [result.insertId]
  );

  return createdRows[0];
}

async function getById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, price, description, created_at FROM products WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function updateById(id, { name, price, description }) {
  const [result] = await pool.query(
    "UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?",
    [name, price, description || null, id]
  );

  if (result.affectedRows === 0) return null;
  return getById(id);
}

async function deleteById(id) {
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, create, getById, updateById, deleteById };


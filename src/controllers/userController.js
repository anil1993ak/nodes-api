const db = require("../config/db");
const userModel = require("../models/userModel");

function ensureDbReady(res) {
  if (db.isDbReady()) return true;
  return res.status(503).json({
    error: "db not ready",
    details: db.getDbInitError()?.message,
  });
}

async function listUsers(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const users = await userModel.getAll();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const { name, email } = req.body || {};

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name is required" });
    }
    if (typeof email !== "string" || email.trim().length === 0) {
      return res.status(400).json({ error: "email is required" });
    }

    const user = await userModel.create({
      name: name.trim(),
      email: email.trim(),
    });

    res.status(201).json(user);
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "email already exists" });
    }
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const user = await userModel.getById(id);
    if (!user) return res.status(404).json({ error: "not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const { name, email } = req.body || {};
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name is required" });
    }
    if (typeof email !== "string" || email.trim().length === 0) {
      return res.status(400).json({ error: "email is required" });
    }

    const updated = await userModel.updateById(id, {
      name: name.trim(),
      email: email.trim(),
    });

    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "email already exists" });
    }
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const deleted = await userModel.deleteById(id);
    if (!deleted) return res.status(404).json({ error: "not found" });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};


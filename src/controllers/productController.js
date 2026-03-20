const db = require("../config/db");
const productModel = require("../models/productModel");

function ensureDbReady(res) {
  if (db.isDbReady()) return true;
  return res.status(503).json({
    error: "db not ready",
    details: db.getDbInitError()?.message,
  });
}

function normalizePrice(value) {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  return Number(num.toFixed(2));
}

async function listProducts(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;
    const products = await productModel.getAll();
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const { name, price, description } = req.body || {};

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name is required" });
    }

    const normalizedPrice = normalizePrice(price);
    if (normalizedPrice === null || normalizedPrice < 0) {
      return res.status(400).json({ error: "price must be a valid number (>= 0)" });
    }

    const product = await productModel.create({
      name: name.trim(),
      price: normalizedPrice,
      description: typeof description === "string" ? description.trim() : undefined,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const product = await productModel.getById(id);
    if (!product) return res.status(404).json({ error: "not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const { name, price, description } = req.body || {};

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name is required" });
    }

    const normalizedPrice = normalizePrice(price);
    if (normalizedPrice === null || normalizedPrice < 0) {
      return res.status(400).json({ error: "price must be a valid number (>= 0)" });
    }

    const updated = await productModel.updateById(id, {
      name: name.trim(),
      price: normalizedPrice,
      description: typeof description === "string" ? description.trim() : undefined,
    });

    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    if (!ensureDbReady(res)) return;

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const deleted = await productModel.deleteById(id);
    if (!deleted) return res.status(404).json({ error: "not found" });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};


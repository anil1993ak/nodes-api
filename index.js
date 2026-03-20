const express = require("express");
require("dotenv").config();

const healthRoutes = require("./src/routes/healthRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const { initDatabase } = require("./src/config/db");

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

if (require.main === module) {
  // DB init background me karte hain; routes aa jati hain.
  initDatabase().finally(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`REST API running: http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/users", userController.listUsers);
router.post("/users", authMiddleware, userController.createUser);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", authMiddleware, userController.updateUser);
router.delete("/users/:id", authMiddleware, userController.deleteUser);

module.exports = router;


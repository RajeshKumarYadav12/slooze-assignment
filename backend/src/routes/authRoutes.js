const express = require("express");
const {
  login,
  getMe,
  logout,
  getUsers,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);
router.get("/users", getUsers);

module.exports = router;

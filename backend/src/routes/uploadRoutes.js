const express = require("express");
const {
  uploadRestaurantImage,
  uploadMenuItemImage,
} = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Require admin role for uploads
router.post(
  "/restaurant/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  uploadRestaurantImage
);
router.post(
  "/menuitem/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  uploadMenuItemImage
);

module.exports = router;

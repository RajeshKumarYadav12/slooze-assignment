const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
} = require("../controllers/restaurantController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { countryMiddleware } = require("../middleware/countryMiddleware");

const router = express.Router();

// All restaurant routes require authentication
router.use(authMiddleware);
router.use(countryMiddleware);

router.get("/", getRestaurants);
router.get("/:id", getRestaurant);
router.post("/", roleMiddleware("ADMIN"), createRestaurant);

module.exports = router;

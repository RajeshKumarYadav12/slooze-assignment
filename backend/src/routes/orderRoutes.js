const express = require("express");
const {
  createOrder,
  getOrders,
  checkoutOrder,
  cancelOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { countryMiddleware } = require("../middleware/countryMiddleware");

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);
router.use(countryMiddleware);

// All roles can create orders and view their orders
router.post("/", createOrder);
router.get("/", getOrders);

// All roles can checkout/place order (ADMIN, MANAGER, MEMBER)
router.post("/:id/checkout", checkoutOrder);

// Only Admin and Manager can cancel orders (MEMBER cannot)
router.post("/:id/cancel", roleMiddleware("ADMIN", "MANAGER"), cancelOrder);

module.exports = router;

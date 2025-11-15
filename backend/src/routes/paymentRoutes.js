const express = require("express");
const {
  updatePaymentMethod,
  getPaymentMethods,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// All payment routes require authentication
router.use(authMiddleware);

// Get payment methods - all authenticated users
router.get("/methods", getPaymentMethods);

// Update payment method - Admin only
router.put("/update", roleMiddleware("ADMIN"), updatePaymentMethod);

module.exports = router;

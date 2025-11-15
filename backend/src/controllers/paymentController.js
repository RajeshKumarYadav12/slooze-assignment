const User = require("../models/User");

// @desc    Update payment method
// @route   PUT /payment/update
// @access  Private (Admin only)
const updatePaymentMethod = async (req, res) => {
  try {
    const { type, cardLast4, provider, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If setting as default, unset all other defaults
    if (isDefault) {
      user.paymentMethods.forEach((pm) => {
        pm.isDefault = false;
      });
    }

    // Add new payment method
    user.paymentMethods.push({
      type,
      cardLast4,
      provider,
      isDefault: isDefault || user.paymentMethods.length === 0,
    });

    await user.save();

    res.json({
      success: true,
      message: "Payment method updated successfully",
      data: user.paymentMethods,
    });
  } catch (error) {
    console.error("Update payment method error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get payment methods
// @route   GET /payment/methods
// @access  Private
const getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("paymentMethods");

    res.json({
      success: true,
      data: user.paymentMethods,
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updatePaymentMethod, getPaymentMethods };

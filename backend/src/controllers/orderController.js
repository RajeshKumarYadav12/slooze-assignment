const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const { applyCountryFilter } = require("../middleware/countryMiddleware");

// @desc    Create new order
// @route   POST /orders
// @access  Private (All roles can create orders)
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress } = req.body;

    // Validate restaurant exists and check country access
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Non-admins can only order from their country's restaurants
    if (req.user.role !== "ADMIN" && restaurant.country !== req.user.country) {
      return res
        .status(403)
        .json({ message: "Cannot order from restaurants in other countries" });
    }

    // Validate and fetch menu items
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: "Some menu items not found" });
    }

    // Prepare order items with prices
    const orderItems = items.map((item) => {
      const menuItem = menuItems.find(
        (mi) => mi._id.toString() === item.menuItemId
      );
      return {
        menuItemId: item.menuItemId,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      restaurantId,
      country: restaurant.country,
      items: orderItems,
      deliveryAddress,
      status: "CREATED",
    });

    await order.populate("restaurantId", "name address");

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders (with country filter)
// @route   GET /orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let filter = { userId: req.user._id };

    // Managers can see all orders from their country
    if (req.user.role === "MANAGER") {
      filter = applyCountryFilter(req);
    }

    // Admins can see all orders
    if (req.user.role === "ADMIN") {
      filter = {};
    }

    const orders = await Order.find(filter)
      .populate("restaurantId", "name address")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Checkout/Pay for order
// @route   POST /orders/:id/checkout
// @access  Private (Admin, Manager only)
const checkoutOrder = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check country access for non-admins
    if (req.user.role !== "ADMIN" && order.country !== req.user.country) {
      return res.status(403).json({ message: "Access denied to this order" });
    }

    // Check if order is already paid or cancelled
    if (order.status === "PAID") {
      return res.status(400).json({ message: "Order already paid" });
    }

    if (order.status === "CANCELLED") {
      return res
        .status(400)
        .json({ message: "Cannot pay for cancelled order" });
    }

    // Update order status
    order.status = "PAID";
    order.paymentMethodId = paymentMethodId || "default";
    await order.save();

    res.json({
      success: true,
      message: "Order paid successfully",
      data: order,
    });
  } catch (error) {
    console.error("Checkout order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel order
// @route   POST /orders/:id/cancel
// @access  Private (Admin, Manager only)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check country access for non-admins
    if (req.user.role !== "ADMIN" && order.country !== req.user.country) {
      return res.status(403).json({ message: "Access denied to this order" });
    }

    // Check if order can be cancelled
    if (order.status === "CANCELLED") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    if (order.status === "DELIVERED") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    // Update order status
    order.status = "CANCELLED";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getOrders, checkoutOrder, cancelOrder };

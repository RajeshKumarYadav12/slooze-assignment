const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const { applyCountryFilter } = require("../middleware/countryMiddleware");

// @desc    Get all restaurants (with country filter)
// @route   GET /restaurants
// @access  Private
const getRestaurants = async (req, res) => {
  try {
    const filter = applyCountryFilter(req);
    const restaurants = await Restaurant.find(filter);

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single restaurant with menu
// @route   GET /restaurants/:id
// @access  Private
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check country access (non-admins can only view their country's restaurants)
    if (req.user.role !== "ADMIN" && restaurant.country !== req.user.country) {
      return res
        .status(403)
        .json({ message: "Access denied to this restaurant" });
    }

    // Get menu items for this restaurant
    const menuItems = await MenuItem.find({
      restaurantId: req.params.id,
      isAvailable: true,
    });

    res.json({
      success: true,
      data: {
        restaurant,
        menu: menuItems,
      },
    });
  } catch (error) {
    console.error("Get restaurant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create restaurant (Admin only)
// @route   POST /restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  try {
    const { name, country, address, cuisine, rating, image } = req.body;

    const restaurant = await Restaurant.create({
      name,
      country,
      address,
      cuisine,
      rating,
      image,
    });

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getRestaurants, getRestaurant, createRestaurant };

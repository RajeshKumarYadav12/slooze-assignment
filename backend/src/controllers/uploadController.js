const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// @desc    Upload restaurant image
// @route   POST /upload/restaurant/:id
// @access  Private/Admin
const uploadRestaurantImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { image: imageUrl },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      restaurant,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Upload menu item image
// @route   POST /upload/menuitem/:id
// @access  Private/Admin
const uploadMenuItemImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { image: imageUrl },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
      menuItem,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { uploadRestaurantImage, uploadMenuItemImage };

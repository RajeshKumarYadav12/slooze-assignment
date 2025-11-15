const User = require("../models/User");

// @desc    Get all users (for login page demo)
// @route   GET /auth/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role country");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers };

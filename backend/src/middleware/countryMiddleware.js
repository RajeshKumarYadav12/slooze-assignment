// Country-based access control middleware
// Managers and Members can only access resources from their country
// Admins have access to all countries

const countryMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Admins bypass country restrictions
  if (req.user.role === "ADMIN") {
    return next();
  }

  // For Managers and Members, store their country for filtering
  req.userCountry = req.user.country;

  next();
};

// Helper function to apply country filter to queries
const applyCountryFilter = (req, filter = {}) => {
  // Admins see everything
  if (req.user.role === "ADMIN") {
    return filter;
  }

  // Managers and Members see only their country
  return { ...filter, country: req.user.country };
};

module.exports = { countryMiddleware, applyCountryFilter };

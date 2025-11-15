require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

// Seed data
const users = [
  {
    name: "Nick Fury",
    email: "nick.fury@shield.com",
    password: "Password1!",
    role: "ADMIN",
    country: "India",
    paymentMethods: [
      {
        type: "credit_card",
        cardLast4: "4242",
        provider: "Visa",
        isDefault: true,
      },
    ],
  },
  {
    name: "Captain Marvel",
    email: "captain.marvel@shield.com",
    password: "Password1!",
    role: "MANAGER",
    country: "India",
    paymentMethods: [],
  },
  {
    name: "Captain America",
    email: "captain.america@shield.com",
    password: "Password1!",
    role: "MANAGER",
    country: "America",
    paymentMethods: [],
  },
  {
    name: "Thanos",
    email: "thanos@titans.com",
    password: "Password1!",
    role: "MEMBER",
    country: "India",
    paymentMethods: [],
  },
  {
    name: "Thor",
    email: "thor@asgard.com",
    password: "Password1!",
    role: "MEMBER",
    country: "India",
    paymentMethods: [],
  },
  {
    name: "Travis",
    email: "travis@usa.com",
    password: "Password1!",
    role: "MEMBER",
    country: "America",
    paymentMethods: [],
  },
];

const restaurants = [
  // India Restaurants
  {
    name: "Mumbai Spice Kitchen",
    country: "India",
    address: "123 MG Road, Mumbai",
    cuisine: "Indian",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
  },
  {
    name: "Delhi Darbar",
    country: "India",
    address: "456 Connaught Place, Delhi",
    cuisine: "North Indian",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
  },
  {
    name: "Bangalore Bistro",
    country: "India",
    address: "789 Brigade Road, Bangalore",
    cuisine: "Multi-Cuisine",
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  },
  // America Restaurants
  {
    name: "New York Pizza Palace",
    country: "America",
    address: "101 Broadway, New York",
    cuisine: "Italian",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
  },
  {
    name: "LA Burger House",
    country: "America",
    address: "202 Sunset Blvd, Los Angeles",
    cuisine: "American",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?w=400&h=300&fit=crop",
  },
  {
    name: "Chicago Steakhouse",
    country: "America",
    address: "303 Michigan Ave, Chicago",
    cuisine: "Steakhouse",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});

    console.log("Seeding users...");
    // Create users one by one to trigger password hashing
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`✓ ${createdUsers.length} users created`);

    console.log("Seeding restaurants...");
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✓ ${createdRestaurants.length} restaurants created`);

    console.log("Seeding menu items...");
    const menuItems = [];

    // Create menu items for each restaurant
    for (const restaurant of createdRestaurants) {
      if (restaurant.country === "India") {
        menuItems.push(
          {
            restaurantId: restaurant._id,
            name: "Butter Chicken",
            description: "Creamy tomato-based curry with tender chicken",
            price: 350,
            category: "Main Course",
            isVegetarian: false,
            image:
              "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Paneer Tikka",
            description: "Grilled cottage cheese with spices",
            price: 280,
            category: "Appetizer",
            isVegetarian: true,
            image:
              "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Biryani",
            description: "Fragrant rice with spices and meat",
            price: 400,
            category: "Main Course",
            isVegetarian: false,
            image:
              "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Mango Lassi",
            description: "Sweet yogurt drink with mango",
            price: 80,
            category: "Beverage",
            isVegetarian: true,
            image:
              "https://images.unsplash.com/photo-1589727959579-fb4485b68e8c?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Gulab Jamun",
            description: "Sweet milk-based dessert",
            price: 100,
            category: "Dessert",
            isVegetarian: true,
            image:
              "https://images.unsplash.com/photo-1606312619070-d48b4cbc5b52?w=300&h=200&fit=crop",
          }
        );
      } else {
        menuItems.push(
          {
            restaurantId: restaurant._id,
            name: "Classic Burger",
            description: "Beef patty with lettuce, tomato, and cheese",
            price: 999,
            category: "Main Course",
            isVegetarian: false,
            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Caesar Salad",
            description: "Fresh romaine with caesar dressing",
            price: 664,
            category: "Appetizer",
            isVegetarian: true,
            image:
              "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Pepperoni Pizza",
            description: "Classic pizza with pepperoni",
            price: 1245,
            category: "Main Course",
            isVegetarian: false,
            image:
              "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Coca Cola",
            description: "Refreshing soft drink",
            price: 249,
            category: "Beverage",
            isVegetarian: true,
            image:
              "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=200&fit=crop",
          },
          {
            restaurantId: restaurant._id,
            name: "Chocolate Cake",
            description: "Rich chocolate dessert",
            price: 581,
            category: "Dessert",
            isVegetarian: true,
            image:
              "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
          }
        );
      }
    }

    const createdMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`✓ ${createdMenuItems.length} menu items created`);

    console.log("\n=== SEED COMPLETED SUCCESSFULLY ===\n");
    console.log("Test Users:");
    console.log("-----------------------------------");
    users.forEach((user) => {
      console.log(`${user.name} (${user.role})`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Country: ${user.country}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();

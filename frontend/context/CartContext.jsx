"use client";

import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("cart");
    const savedRestaurant = localStorage.getItem("cartRestaurant");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedRestaurant) {
      setRestaurant(JSON.parse(savedRestaurant));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
    if (restaurant) {
      localStorage.setItem("cartRestaurant", JSON.stringify(restaurant));
    }
  }, [cart, restaurant]);

  const addToCart = (item, restaurantInfo) => {
    // Check if cart is from different restaurant
    if (restaurant && restaurant.id !== restaurantInfo.id) {
      const confirm = window.confirm(
        "Your cart contains items from another restaurant. Do you want to clear it and add items from this restaurant?"
      );
      if (!confirm) return;
      setCart([]);
    }

    setRestaurant(restaurantInfo);

    const existingItem = cart.find(
      (cartItem) => cartItem.menuItemId === item.menuItemId
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.menuItemId === item.menuItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuItemId) => {
    const newCart = cart.filter((item) => item.menuItemId !== menuItemId);
    setCart(newCart);
    if (newCart.length === 0) {
      setRestaurant(null);
      localStorage.removeItem("cartRestaurant");
    }
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("cartRestaurant");
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    restaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

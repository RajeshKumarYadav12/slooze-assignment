"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import MenuItemCard from "../../../components/MenuItemCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function RestaurantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, restaurant } = useCart();

  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchRestaurantDetails(params.id);
    }
  }, [params.id]);

  const fetchRestaurantDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurantData(response.data.data.restaurant);
      setMenuItems(response.data.data.menu);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      setError("Failed to load restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (restaurant && restaurant.id !== restaurantData._id) {
      if (!confirm(`You have items from ${restaurant.name}. Clear cart and add from ${restaurantData.name}?`)) {
        return;
      }
      clearCart();
    }
    addToCart(item, { id: restaurantData._id, name: restaurantData.name });
  };

  const handleCreateOrder = async () => {
    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address");
      return;
    }

    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    setOrderLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const orderData = {
        restaurantId: restaurant.id,
        items: cart.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
        deliveryAddress,
      };

      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert(`Order placed successfully! Order ID: ${response.data.data._id}`);
        clearCart();
        setDeliveryAddress("");
        setShowCart(false);
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.response?.data?.message || "Failed to create order");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading restaurant details...</div>
      </div>
    );
  }

  if (error && !restaurantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.push("/restaurants")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/restaurants")}
          className="mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm sm:text-base transition-colors"
        >
          ← Back to Restaurants
        </button>

        {/* Restaurant Header */}
        {restaurantData && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <img
                src={restaurantData.image.startsWith("http") ? restaurantData.image : `${API_URL}${restaurantData.image}`}
                alt={restaurantData.name}
                className="w-full md:w-64 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{restaurantData.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 mb-2">{restaurantData.cuisine} Cuisine</p>
                <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {restaurantData.address}
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {restaurantData.country}
                </p>
                <div className="flex items-center text-yellow-500">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-sm sm:text-base">{restaurantData.rating}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold">Menu</h2>
            {cart.length > 0 && (
              <button
                onClick={() => setShowCart(true)}
                className="w-full sm:w-auto relative px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base transition-colors"
              >
                View Cart ({cart.length} items)
              </button>
            )}
          </div>

          {menuItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm sm:text-base">
              No menu items available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Your Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl"
                  >
                    ×
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="font-semibold">Restaurant: {restaurant?.name}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div
                          key={item.menuItemId}
                          className="flex justify-between items-center border-b pb-3"
                        >
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-gray-600">
                                ₹{item.price}
                              </p>
                            </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.menuItemId)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                      <div className="border-t pt-4 mb-4">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span>
                            ₹{getTotal()}
                          </span>
                        </div>
                      </div>                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter your delivery address"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleCreateOrder}
                        disabled={orderLoading}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {orderLoading ? "Placing Order..." : "Place Order"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Clear all items from cart?")) {
                            clearCart();
                            setShowCart(false);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <RestaurantDetailsPage />
    </ProtectedRoute>
  );
}

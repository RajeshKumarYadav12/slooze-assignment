"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CartModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal, restaurant } = useCart();
  const router = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    if (!user) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }

    if (user.role === "MEMBER") {
      alert("Members cannot place orders. Please upgrade to Manager or Admin role.");
      return;
    }

    try {
      setLoading(true);
      const orderItems = cart.map((item) => ({
        menuItem: item.menuItemId,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          restaurant: restaurant.id,
          items: orderItems,
          deliveryAddress: deliveryAddress,
        },
        { withCredentials: true }
      );

      alert("Order placed successfully!");
      clearCart();
      setDeliveryAddress("");
      onClose();
      router.push("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-4xl leading-none -mt-2"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm sm:text-base mb-4">Your cart is empty</p>
              <button
                onClick={() => {
                  router.push("/restaurants");
                  onClose();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Restaurant Info */}
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-900">Restaurant: {restaurant?.name}</p>
              </div>

              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="pb-6 border-b border-gray-200">
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-700 text-lg">₹{item.price}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-xl font-semibold"
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-xl font-semibold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="text-red-600 hover:text-red-700 text-base font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">₹{getTotal()}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 text-base resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Clear all items from cart?")) {
                      clearCart();
                      setDeliveryAddress("");
                    }
                  }}
                  className="px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "../context/AuthContext";

export default function MenuItemCard({ item, onAddToCart }) {
  const { user } = useAuth();

  const handleAddToCart = () => {
    const cartItem = {
      menuItemId: item._id,
      name: item.name,
      price: item.price,
    };
    onAddToCart(cartItem);
  };

  // Format price in INR
  const formatPrice = (price) => {
    return `₹${price}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={
          item.image.startsWith("http")
            ? item.image
            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${
                item.image
              }`
        }
        alt={item.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
          {item.isVegetarian && (
            <span className="flex items-center text-green-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Veg
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3">{item.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-blue-600">
              {formatPrice(item.price)}
            </p>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>

          {item.isAvailable ? (
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm"
            >
              Add to Cart
            </button>
          ) : (
            <span className="text-red-500 text-sm font-medium">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import CartModal from "./CartModal";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!isAuthenticated) return null;

  return (
    <>
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            FoodOrder
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/restaurants"
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Restaurants
            </Link>
            <Link
              href="/orders"
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/payment"
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Payment
            </Link>

            {/* Cart */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowCartModal(true)}
                className="hover:bg-blue-700 px-3 py-2 rounded flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="hidden xl:inline">Cart</span>
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </div>

            {/* User Info - Desktop */}
            <div className="ml-4 flex items-center space-x-3 border-l border-blue-500 pl-4">
              <div className="text-sm">
                <div className="font-semibold">{user?.name}</div>
                <div className="text-xs text-blue-200">
                  {user?.role} • {user?.country}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/restaurants"
              className="block hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link
              href="/orders"
              className="block hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/payment"
              className="block hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Payment Methods
            </Link>

            {/* Cart - Mobile */}
            <button
              onClick={() => {
                setShowCartModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left hover:bg-blue-700 px-3 py-2 rounded transition-colors relative flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Cart
              {getItemCount() > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {getItemCount()} items
                </span>
              )}
            </button>

            {/* User Info - Mobile */}
            <div className="border-t border-blue-500 mt-2 pt-2">
              <div className="px-3 py-2 text-sm">
                <div className="font-semibold">{user?.name}</div>
                <div className="text-xs text-blue-200">
                  {user?.role} • {user?.country}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm font-medium transition-colors mt-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
    
    {/* Cart Modal */}
    <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </>
  );
}

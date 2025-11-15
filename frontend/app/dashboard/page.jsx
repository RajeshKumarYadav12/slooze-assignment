"use client";

import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const features = [
    {
      title: "Browse Restaurants",
      description: "Explore restaurants and their menus",
      icon: "restaurant",
      link: "/restaurants",
      roles: ["ADMIN", "MANAGER", "MEMBER"],
    },
    {
      title: "View Orders",
      description: "Check your order history and status",
      icon: "orders",
      link: "/orders",
      roles: ["ADMIN", "MANAGER", "MEMBER"],
    },
    {
      title: "Manage Payments",
      description: "Update payment methods",
      icon: "payment",
      link: "#",
      roles: ["ADMIN"],
    },
  ];

  const permissions = {
    ADMIN: [
      "View all restaurants and menus",
      "Create orders and add items",
      "Checkout and pay for orders",
      "Cancel orders",
      "Update payment methods",
      "Access all countries",
    ],
    MANAGER: [
      "View restaurants and menus",
      "Create orders and add items",
      "Checkout and pay for orders",
      "Cancel orders",
      "Country-specific access",
    ],
    MEMBER: [
      "View restaurants and menus",
      "Create orders and add items",
      "Country-specific access",
      "Cannot checkout or pay",
      "Cannot cancel orders",
    ],
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <div className="flex gap-4 mt-4">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                Role: {user?.role}
              </span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                Country: {user?.country}
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {features
              .filter((feature) => feature.roles.includes(user?.role))
              .map((feature, index) => (
                <Link key={index} href={feature.link}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="text-4xl mb-4">
                      {feature.icon === "payment" ? (
                        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                      ) : feature.icon === "restaurant" ? (
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      ) : feature.icon === "orders" ? (
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      ) : (
                        feature.icon
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Link>
              ))}
          </div>

          {/* Permissions Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Permissions ({user?.role})
            </h2>
            <ul className="space-y-2">
              {permissions[user?.role]?.map((permission, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{permission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

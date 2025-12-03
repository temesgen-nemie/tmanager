"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const userInitial = user?.name?.[0]?.toUpperCase() ?? "U"; // fallback "U"
  const userName = user?.name ?? "Unknown"; // fallback name

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      {/* Logo / App Name */}
      <div className="flex items-center space-x-2">
        <span className="font-bold text-xl text-gray-800">TaskManager</span>
      </div>

      {/* Profile Section */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {userInitial}
            </div>
            <span className="hidden sm:block text-gray-700">{userName}</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/change-password");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}

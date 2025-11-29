"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tasks", path: "/dashboard/tasks" },
    { name: "Profile", path: "/dashboard/profile" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  const navigate = (path: string) => {
    router.push(path);
    setSidebarOpen(false); // close sidebar on mobile
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for large screens */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">TaskManager</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className="cursor-pointer hover:text-gray-300"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-gray-800 text-white p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-2 right-2 p-1"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6">TaskManager</h2>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li
                  key={item.path}
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4">
        <button
          className="md:hidden mb-4 p-2 border rounded"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </button>
        {children}
      </main>
    </div>
  );
}

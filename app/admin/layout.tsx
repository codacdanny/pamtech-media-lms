"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiUsers,
  FiBook,
  FiMenu,
  FiX,
  FiHome,
  FiLogOut,
  FiBarChart,
} from "react-icons/fi";

const menuItems = [
  { icon: FiUsers, label: "Manage Students", path: "/admin/students" },
  { icon: FiBook, label: "Manage Courses", path: "/admin/courses" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <h1
              className={`font-bold text-[#307BE9] ${
                isSidebarOpen ? "text-xl" : "text-sm"
              }`}>
              {isSidebarOpen ? "Admin Panel" : "AP"}
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-[#307BE9]">
              {isSidebarOpen ? (
                <FiMenu className="w-6 h-6" />
              ) : (
                <FiX className="w-6 h-6" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center p-3 mb-2 rounded-lg transition-colors ${
                  pathname === item.path
                    ? "bg-blue-50 text-[#307BE9]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                <item.icon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <FiLogOut className="w-6 h-6" />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === pathname)?.label ||
                "Dashboard"}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

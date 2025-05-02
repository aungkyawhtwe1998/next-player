"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { logout } from "@/features/auth/authSlice";
import { FiMenu, FiLogOut, FiX } from "react-icons/fi";
import { logoutAction } from "@/actions/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(true);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (!isAuthenticated || pathname == '/') return null;

  const routes = [
    { name: "Players", href: "/dashboard" },
    { name: "Teams", href: "/dashboard/teams" },
  ];

  const handleLogout = async () => {
    await logoutAction();
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className="sticky h-screen top-0">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 dark:bg-gray-800  p-2 rounded"
        onClick={() => setCollapsed(!collapsed)}>
        {!collapsed ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`dark:bg-gray-800 bg-gray-100 shadow-sm pt-10  w-64 h-screen flex-shrink-0 z-40 transition-transform duration-300 transform md:translate-x-0 fixed md:relative top-0 left-0 ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}>
        <div className="flex flex-col p-4 space-y-6 h-full justify-between">
          <div>
            <h2 className="text-2xl font-bold text-center ">Next Player</h2>
            <nav className="mt-6 space-y-4">
              {routes.map((route, index) => {
                const isActive = pathname === route.href;
                return (
                  <Link
                    key={index}
                    href={route.href}
                    className={`block px-4 py-2 text-lg rounded transition-colors ${
                      isActive
                        ? "dark:bg-gray-700 bg-gray-200"
                        : "hover:dark:bg-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setCollapsed(true)}>
                    {route.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 dark:bg-gray-700 bg-gray-200 hover:dark:bg-gray-100 hover:bg-gray-300 rounded text-red-600 dark:text-red-500 text-lg flex items-center justify-center gap-2">
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

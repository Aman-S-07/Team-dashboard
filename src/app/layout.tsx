"use client";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"; // Import icons
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarVisible, setSidebarVisible] = useState(true); // Default is visible

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        {isSidebarVisible && (
          <nav className="bg-blue-500 text-white w-64 p-6 shadow-md fixed top-0 left-0 h-full transition-all duration-300 z-50">
            <div className="flex items-center mb-8">
              <h1 className="text-2xl font-bold flex-1">Team Dashboard</h1>
              {/* Sidebar close button */}
              {/* <button
                onClick={() => setSidebarVisible(false)}
                className="text-white focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button> */}
            </div>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Task Management
                </Link>
              </li>
            </ul>
          </nav>
        )}

        {/* Transparent Sidebar Toggle Icon */}
        <button
          onClick={() => setSidebarVisible(!isSidebarVisible)}
          className={`fixed top-4 left-4 z-50 p-2 rounded-full text-gray-600 transition-all duration-300 ${
            isSidebarVisible ? "bg-transparent" : "bg-transparent"
          } hover:bg-blue-500 hover:text-white`}
        >
          {isSidebarVisible ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Main Content */}
        <div
          className={`p-6 flex-1 transition-all duration-300 ${
            isSidebarVisible ? "ml-64" : "ml-16"
          }`}
        >
          {children}
        </div>
      </body>
    </html>
  );
}

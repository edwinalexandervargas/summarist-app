"use client";

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import SearchBar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <div
          className="sidebar__backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="dashboard__content">
        <div className="dashboard__header">
          <SearchBar />
          <button
            className="dashboard__hamburger"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        </div>
        <main className="dashboard__main">
          {children}
        </main>
      </div>
    </div>
  );
}
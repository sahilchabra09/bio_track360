"use client";
import { BentoGridDemo } from "@/components/dashboard";
import { SidebarDash } from "@/components/sidebar-dash";
import React from "react";

function Dashboard() {
  return (
    <div className="flex">
      {/* Sidebar will take up a fixed width */}
      <SidebarDash />
      {/* The BentoGridDemo will take up the remaining space */}
      <div className="flex-1">
        <BentoGridDemo />
      </div>
    </div>
  );
}

export default Dashboard;

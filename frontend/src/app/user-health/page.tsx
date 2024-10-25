"use client";
import HeartRateComponent from "@/components/heart-rate";
import { CardHoverEffectDemo } from "@/components/myhealth";
import { SidebarDash } from "@/components/sidebar-dash";
import React from "react";

function UserHealth() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarDash />

      {/* Main Content (3D Cards) */}
      <div className="flex-grow p-0 m-0 pt-10 ml-5">
        <h1 className="text-3xl font-bold text-center text-neutral-600 dark:text-white mb-4">
          Your Health Dashboard
        </h1>
        {/* <CardHoverEffectDemo /> */}
        <HeartRateComponent />
      </div>
    </div>
  );
}

export default UserHealth;

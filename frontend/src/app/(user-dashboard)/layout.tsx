"use client";
import { SidebarDash } from "@/components/sidebar-dash";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <SidebarDash />
      <main className="flex-1 p-4 h-[100vh] overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;

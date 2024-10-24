"use client";
import { SidebarDash } from "@/components/sidebar-dash";
import { FileUploadRep } from "@/components/upload-rep";
import React, { useEffect } from "react";

function uploadfile() {
  useEffect(() => {
    console.log("Dashboard component rendered");
  }, []);

  return (
    <div className="flex">
      <SidebarDash />
      <main className="flex-1 p-4">
        <FileUploadRep />
      </main>
    </div>
  );
}

export default uploadfile;

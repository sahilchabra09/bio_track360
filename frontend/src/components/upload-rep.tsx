"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { useResponse } from "@/context/ResponseContext";

export function FileUploadRep() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setResponse } = useResponse();

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    console.log(files);

    if (files.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]);

      try {
        setIsLoading(true);
        const response = await fetch("https://rehab360.pythonanywhere.com/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.text();
          setResponse(responseData);
          router.push('/summary');
        } else {
          alert("Error uploading file. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <FileUpload onChange={handleFileUpload} />
        </div>
      )}
    </div>
  );
}

"use client";
import React from "react"; // Import React to use React.use()
import Document from "@/components/Document";

function DocumentPage({ params  }: { params: { id: string } }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams; // Destructure the id from the unwrapped params

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
      
    </div>
  );
}

export default DocumentPage;
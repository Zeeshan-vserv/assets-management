import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingSpinner() {
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <AiOutlineLoading3Quarters
          size={20}
          className="animate-spin text-blue-500"
        />
        Loading...
      </div>
    </>
  );
}

export default LoadingSpinner;

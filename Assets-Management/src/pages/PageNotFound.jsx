import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-600 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Oops! The page you are looking for doesn't exist.
          </p>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
            onClick={() => navigate("")}
          >
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;

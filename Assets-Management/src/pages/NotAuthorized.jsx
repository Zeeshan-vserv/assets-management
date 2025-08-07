import React from "react";
const NotAuthorized = () => {

  const handleGoBack = () => {
    window.history.go(-2);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-200 to-sky-400 overflow-hidden text-center">
      {/* Sun */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300 rounded-full opacity-30 blur-2xl animate-pulse z-0"></div>

      {/* Clouds */}
      <div className="absolute top-28 left-[-150px] animate-cloudSlow z-10 opacity-70">
        <CloudSVG width={140} />
      </div>
      <div className="absolute top-48 left-20 animate-cloudFast z-10 opacity-60">
        <CloudSVG width={100} />
      </div>
      <div className="absolute top-20 left-1/2 animate-cloudFast z-10 opacity-50">
        <CloudSVG width={160} />
      </div>

      {/* Plane with shadow */}
      <div className="absolute top-1/3 left-[-120px] animate-planeFly z-20">
        <PlaneSVG />
        <div className="w-28 h-2 bg-black/20 rounded-full blur-sm mx-auto mt-[-10px]" />
      </div>
      {/* 404 Text */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-xl mb-4">
          🛫 Access Denied
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8">
          You do not have the necessary permissions to access this resource.
        </p>
        <p className="text-xl md:text-2xl text-white/90 mb-8">
          If you believe this is an error, please contact the system administrator or support team for assistance.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 text-lg font-semibold bg-white text-blue-600 rounded-full shadow-md hover:scale-105 hover:bg-blue-100 transition-transform duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

const CloudSVG = ({ width }) => (
  <svg
    width={width}
    height={width / 2}
    viewBox="0 0 64 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 20a10 10 0 1 1 20 0h2a6 6 0 1 1 0 12H16a8 8 0 1 1 4-12Z"
      fill="white"
    />
  </svg>
);

const PlaneSVG = () => (
  <svg
    width="120"
    height="50"
    viewBox="0 0 120 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 22h80l10-10v20l-10-10H5z" fill="#1E40AF" />
    <rect x="90" y="20" width="25" height="10" fill="#3B82F6" />
    <circle cx="95" cy="25" r="3" fill="white" />
    <circle cx="105" cy="25" r="3" fill="white" />
  </svg>
);

export default NotAuthorized;

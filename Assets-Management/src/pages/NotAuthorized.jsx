import React from "react";

function NotAuthorized() {
  const handleGoBack = () => {
    window.history.go(-2);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>You are not allowed to access this page.</h1>
      <p>Please contact your administrator if you believe this is a mistake.</p>
      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
}

export default NotAuthorized;
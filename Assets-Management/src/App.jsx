import "./api/axiosConfig";
import React, { useState } from "react";
import Main from "./pages/Main.jsx";
import Login from "./pages/Login.jsx";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NotAuthorized from "./pages/NotAuthorized.jsx";

function App() {
  const user = useSelector((state) => state.authReducer.authData);
  const [count, setCount] = useState(0);
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/main/dashboard/asset" /> : <Login />}
        />
        {/* Only render Main if not on /not-authorized */}
        <Route
          path="/main/*"
          element={
            location.pathname !== "/not-authorized"
              ? (user ? <Main /> : <Navigate to="/auth" />)
              : null
          }
        />
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </>
  );
}

export default App;
import React, { useState } from "react";
import Main from "./components/Main.jsx";
import Login from "./components/Login.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
function App() {
  const user = useSelector((state) => state.authReducer.authData);
  // const [count, setCount] = useState(0);
  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/main" /> : <Login />}
        />
        <Route
          path="/main/*"
          element={user ? <Main /> : <Navigate to="/auth" />}
        />
        <Route path="/" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;


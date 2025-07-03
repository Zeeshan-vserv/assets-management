import React, { useState } from "react";
import Main from "./components/Main.jsx";
import Login from "./components/Login.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Body from "./components/Body.jsx";
// import DashboardAsset from "./components/Dashboard/DashboardAsset.jsx";
function App() {
  const user = useSelector((state) => state.authReducer.authData);
  const [count, setCount] = useState(0);
  return (
    <>
      <Routes>
        <Route
          path="/main"
          element={user ? <Main /> : <Navigate to="/auth" />}
        />
      </Routes>
    </>
  );
}

export default App;

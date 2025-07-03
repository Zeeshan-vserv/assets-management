import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "react-redux";
import store from "./store2/ReduxStore2.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2000} />
        <App />
      </BrowserRouter>
    </LocalizationProvider>
    </Provider>
  </StrictMode>
);

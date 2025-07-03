import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import store from "./store/ReduxStore.js";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <ToastContainer position="top-right" autoClose={2000} />
            <Routes>
              <Route path="*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </Provider>
    </MantineProvider>
  </StrictMode>
);

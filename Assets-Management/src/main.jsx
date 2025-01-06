import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import store from "./store/ReduxStore.js";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </MantineProvider>
  </StrictMode>
);

import axios from "axios";
import store from "../store/ReduxStore";
import { logout } from "../action/AuthAction";

const API = axios.create({ baseURL: "http://localhost:5001" });

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle token expiry or invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      window.location.href = "/auth";
    } else if (
      error.response &&
      error.response.status === 403 &&
      window.location.pathname !== "/not-authorized"
    ) {
      window.location.assign("/not-authorized");
    }
    return Promise.reject(error);
  }
);

export const createGatePass = (formData) =>
  API.post("gatePass/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllGatePass = () => API.get("gatePass/");
export const getGatePassById = (id) => API.get(`gatePass/${id}`);
export const updateGatePass = (id, formData) =>
  API.put(`gatePass/${id}`, formData);
export const deleteGatePass = (id) => API.delete(`gatePass/${id}`);
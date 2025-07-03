import axios from "axios";
import store from "../store/ReduxStore";
import { UserLogout } from "../action/AuthAction";

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
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      store.dispatch(UserLogout());
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export const createAsset = (formData) =>
  API.post("asset/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const createIncident = (formData) => API.post("/incident", formData);
export const getAllIncident = () => API.get("/incident");
export const getIncidentById = (id) => API.get(`/incident/${id}`);
export const updateIncident = (id, updateData) =>
  API.put(`/incident/${id}`, updateData);
export const deleteIncident = (id) => API.delete(`/incident/${id}`);

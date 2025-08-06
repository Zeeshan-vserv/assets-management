import axios from "axios";
import store from "../store2/ReduxStore2";
import { logout } from "../action2/AuthAction2";

const API = axios.create({ baseURL: 'http://localhost:5001' })

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      store.dispatch(logout());
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// export const createAsset = (formData) =>
//   API.post("asset/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

export const createIncident = (formData) =>
  API.post("/incident", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getAllIncident = () => API.get("/incident");
export const getIncidentById = (id) => API.get(`/incident/${id}`);
export const getIncidentByUserId = (userId) => API.get(`/incident/user/${userId}`);
export const updateIncident = (id, updateData) =>
  API.put(`/incident/${id}`, updateData);
export const deleteIncident = (id) => API.delete(`/incident/${id}`);

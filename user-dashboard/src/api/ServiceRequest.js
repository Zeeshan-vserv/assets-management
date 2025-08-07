import axios from "axios";
import store from "../store2/ReduxStore2";
import { logout } from "../action2/AuthAction2";

const API = axios.create({ baseURL: import.meta.env.VITE_API_KEY })

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

export const createServiceRequest = (formDatas) => API.post("/service/", formDatas);
export const getMyPendingApprovals = () => API.get("/service/my-approvals");
export const approveServiceRequest = (id, action, remarks) => API.post(`/service/${id}/approve`, { action, remarks });
export const getAllServiceRequests = () => API.get("/service/");
export const getServiceRequestById = (id) => API.get(`/service/${id}`);
export const getServiceRequestByUserId = (userId) => API.get(`/service/user/${userId}`);
export const updateServiceRequest = (id, updateData) =>API.put(`/service/${id}`, updateData);
export const deleteServiceRequest = (id) => API.delete(`/service/${id}`);
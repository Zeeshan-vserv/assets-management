import axios from "axios";
import store from "../store/ReduxStore";
import { logout } from "../action/AuthAction";

const API = axios.create({ baseURL: "http://localhost:5001" });

// Attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

// Handle token expiry or invalid token
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(logout())
            window.location.href = '/auth' 
        } else if (error.response && error.response.status === 403) {
            window.location.href = '/not-authorized';
        }
        return Promise.reject(error)
    }
)


export const createAsset = (formData) =>
  API.post("asset/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const createServiceRequest = (formData) => API.post("/service", formData);
export const approveServiceRequest = (id) => API.post(`/service/${id}/approve`);
export const getAllServiceRequests = () => API.get("/service");
export const getServiceRequestStatusCounts = () => API.get("/service/status-counts");
export const getServiceRequestById = (id) => API.get(`/service/${id}`);
export const updateServiceRequest = (id, updateData) =>
  API.put(`/service/${id}`, updateData);
export const deleteServiceRequest = (id) => API.delete(`/service/${id}`);
export const getAllServiceSla = () =>
  API.get(`/service/sla-all`);

export const getAllServicesTat = () =>
  API.get(`/service/tat-all`);

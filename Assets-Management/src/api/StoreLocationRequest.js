import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });


API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export const createStoreLocation = (formData) => API.post("/storeLocation", formData);
export const getAllStoreLocations = () => API.get("/storeLocation");
export const getStoreLocationById = (id) => API.get(`/storeLocation/${id}`);
export const updateStoreLocation = (id, formData) => API.put(`/storeLocation/${id}`, formData);
export const deleteStoreLocation = (id) => API.delete(`/storeLocation/${id}`);
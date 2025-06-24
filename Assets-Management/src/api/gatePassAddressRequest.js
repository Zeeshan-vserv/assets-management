import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });


API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})


export const createGatePassAddress = (formData) => API.post("/gatePassAddress", formData);
export const getAllGatePassAddress = () => API.get("/gatePassAddress");
export const getGatePassAddressById = (id) => API.get(`/gatePassAddress/${id}`);
export const updateGatePassAddress = (id, formData) => API.put(`/gatePassAddress/${id}`, formData);
export const deleteGatePassAddress = (id) => API.delete(`/gatePassAddress/${id}`);
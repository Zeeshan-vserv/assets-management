import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });


API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export const createComponent = (formData) => API.post("/component", formData);
export const getAllComponent = () => API.get("/component");
export const getComponentById = (id) => API.get(`/component/${id}`);
export const updateComponent = (id, formData) => API.put(`/component/${id}`, formData);
export const deleteComponent = (id) => API.delete(`/component/${id}`);

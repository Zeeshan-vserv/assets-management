import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });


API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})


export const createIncidentStatus = (formData) => API.post("/incidentStatus", formData);
export const getAllIncidentStatus = () => API.get("/incidentStatus");
export const getIncidentStatusById = (id) => API.get(`/incidentStatus/${id}`);
export const updateIncidentStatus = (id, formData) => API.put(`/incidentStatus/${id}`, formData);
export const deleteIncidentStatus = (id) => API.delete(`/incidentStatus/${id}`);
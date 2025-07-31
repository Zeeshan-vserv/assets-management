import axios from "axios";

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


export const createIncidentStatus = (formData) => API.post("/incidentStatus", formData);
export const getAllIncidentStatus = () => API.get("/incidentStatus");
export const getIncidentStatusById = (id) => API.get(`/incidentStatus/${id}`);
export const updateIncidentStatus = (id, formData) => API.put(`/incidentStatus/${id}`, formData);
export const deleteIncidentStatus = (id) => API.delete(`/incidentStatus/${id}`);
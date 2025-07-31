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


export const createGatePassAddress = (formData) => API.post("/gatePassAddress", formData);
export const getAllGatePassAddress = () => API.get("/gatePassAddress");
export const getGatePassAddressById = (id) => API.get(`/gatePassAddress/${id}`);
export const updateGatePassAddress = (id, formData) => API.put(`/gatePassAddress/${id}`, formData);
export const deleteGatePassAddress = (id) => API.delete(`/gatePassAddress/${id}`);
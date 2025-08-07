import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_KEY });


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

export const createComponent = (formData) => API.post("/component", formData);
export const getAllComponent = () => API.get("/component");
export const getComponentById = (id) => API.get(`/component/${id}`);
export const updateComponent = (id, formData) => API.put(`/component/${id}`, formData);
export const deleteComponent = (id) => API.delete(`/component/${id}`);

import axios from 'axios';
import store from '../store/ReduxStore';
import { logout } from '../action/AuthAction';

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

// Vendor Request
export const createVendor = (formData) => API.post('/vendor', formData);

export const getAllVendors = () => API.get("/vendor");

export const getVendorById = (id) => API.get(`/vendor/${id}`);

export const updateVendor = (id, updatedData) => API.put(`/vendor/${id}`,updatedData);

export const deleteVendor = (id)=>API.delete(`/vendor/${id}`)
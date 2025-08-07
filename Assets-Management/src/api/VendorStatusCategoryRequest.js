import axios from 'axios'
import store from '../store/ReduxStore'
import { logout } from '../action/AuthAction'

const API = axios.create({ baseURL: import.meta.env.VITE_API_KEY })

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


//Category
export const createVendorCategory = (formData) => API.post('/vendorCategory/', formData)
export const getAllVendorCategory = () => API.get('/vendorCategory/')
export const getVendorCategoryById = (id) => API.get(`/vendorCategory/${id}`)
export const updateVendorCategory = (id, updatedData) => API.put(`/vendorCategory/${id}`, updatedData)
export const deleteVendorCategory = (id) => API.delete(`/vendorCategory/${id}`)

//Status
export const createStatus = (formData) => API.post('/status/', formData)
export const getAllStatus = () => API.get('/status/')
export const getStatusById = (id) => API.get(`/status/${id}`)
export const updateStatus = (id, updatedData) => API.put(`/status/${id}`, updatedData)
export const deleteStatus = (id) => API.delete(`/status/${id}`)

//Service Category
export const createVendorServiceCategory = (formData) => API.post('/vendorServiceCategory/', formData)
export const getAllVendorServiceCategory = () => API.get('/vendorServiceCategory/')
export const getVendorServiceCategoryById = (id) => API.get(`/vendorServiceCategory/${id}`)
export const updateVendorServiceCategory = (id, updatedData) => API.put(`/vendorServiceCategory/${id}`, updatedData)
export const deleteVendorServiceCategory = (id) => API.delete(`/vendorServiceCategory/${id}`)
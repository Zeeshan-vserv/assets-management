import axios from 'axios'
import store from '../store/ReduxStore'
import { logout } from '../action/AuthAction'

const API = axios.create({ baseURL: 'http://localhost:5001' })

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
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            store.dispatch(logout())
            window.location.href = '/auth' 
        }
        return Promise.reject(error)
    }
)


//Category
const createVendorCategory = (formData) => API.post('/vendorCategory/', formData)
const getAllVendorCategory = () => API.get('/vendorCategory/')
const getVendorCategoryById = (id) => API.get(`/vendorCategory/${id}`)
const updateVendorCategory = (id, updatedData) => API.put(`/vendorCategory/${id}`, updatedData)
const deleteVendorCategory = (id) => API.delete(`/vendorCategory/${id}`)

//Status
const createStatus = (formData) => API.post('/status/', formData)
const getAllStatus = () => API.get('/status/')
const getStatusById = (id) => API.get(`/status/${id}`)
const updateStatus = (id, updatedData) => API.put(`/status/${id}`, updatedData)
const deleteStatus = (id) => API.delete(`/status/${id}`)

//Service Category
const createVendorServiceCategory = (formData) => API.post('/vendorServiceCategory/', formData)
const getAllVendorServiceCategory = () => API.get('/vendorServiceCategory/')
const getVendorServiceCategoryById = (id) => API.get(`/vendorServiceCategory/${ id}`)
const updateVendorServiceCategory = (id, updatedData) => API.put(`/vendorServiceCategory/${id}`, updatedData)
const deleteVendorServiceCategory = (id) => API.delete(`/vendorServiceCategory/${id}`)
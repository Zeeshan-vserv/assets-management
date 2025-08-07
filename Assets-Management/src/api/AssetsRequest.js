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

export const createAsset = (formData) =>
  API.post('asset/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getAllAssets = () => API.get('asset/');

export const getAssetStatusCounts = () => API.get('asset/asset-counts');

export const getAssetById = (id) => API.get(`asset/${id}`);

export const updateAsset = (id, formData) => API.put(`asset/${id}`, formData);

export const deleteAsset = (id) => API.delete(`asset/${id}`)

export const uploadAssetFromExcel = (formData)=>API.post('asset/upload-excel',formData)

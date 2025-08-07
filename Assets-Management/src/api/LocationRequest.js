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
//Location
export const createLocation = (formData) => API.post('/location', formData);
export const getAllLocation = ()=>API.get('/location')
export const updateLocation = (id,updateData)=>API.put(`/location/${id}`,updateData)
export const getLocationById = (id)=>API.get(`/location/${id}`)
export const deleteLocation = (id)=>API.delete(`/location/${id}`)

//Sub-Location
export const addSubLOcation = (locationId,subLocationData)=>API.post(`/location/${locationId}/sublocation`,subLocationData)
export const getAllSubLocation = ()=>API.get('/location/sublocation')
export const getSubLocationById = (id)=>API.get(`/location/sublocation/${id}`)
export const updateSubLocation = (id, updateData)=>API.put(`/location/sublocation/${id}`,updateData)
export const deleteSubLocation =(locationId, subLocationId)=>API.delete(`/location/${locationId}/sublocation/${subLocationId}`)
import axios from 'axios';
import store from '../store/ReduxStore';
import { logout } from '../action/AuthAction';

const API = axios.create({ baseURL: 'http://localhost:5001' });

// Attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Handle token expiry or invalid token
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            store.dispatch(logout());
            window.location.href = '/auth'; 
        }
        return Promise.reject(error);
    }
);

//Support
export const createSupportDepartment = (formData) => API.post('/supportDepartment', formData);
export const getAllSupportDepartment = ()=>API.get('/supportDepartment')
export const updateSupportDepartment = (id,updateData)=>API.put(`/supportDepartment/${id}`,updateData)
export const getSupportDepartmentById = (id)=>API.get(`/supportDepartment/${id}`)
export const deleteSupportDepartment = (id)=>API.delete(`/supportDepartment/${id}`)

//Sipport Group
export const addSupportGroup = (locationId,subLocationData)=>API.post(`/supportDepartment/${locationId}/supportGroup`,subLocationData)
export const getAllSupportGroup = ()=>API.get('/supportDepartment/supportGroup')
export const getSupportGroupById = (id)=>API.get(`/supportDepartment/supportGroup/${id}`)
export const updateSupportGroup = (id, updateData)=>API.put(`/supportDepartment/supportGroup/${id}`,updateData)
export const deleteSupportGroup =(locationId, subLocationId)=>API.delete(`/supportDepartment/${locationId}/supportGroup/${subLocationId}`)
import axios from 'axios';
import store from '../store/ReduxStore';
import { logout } from '../action/AuthAction';

const API = axios.create({ baseURL: 'http://localhost:5001' });

// Attach token to every request
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


export const createDepartment = (formData) => API.post('/department', formData);
export const addSubDepartment = (id, formData) => API.post(`/department/${id}/subdepartment`, formData);
export const getAllDepartment = () => API.get('/department');
export const getAllSubDepartment = () => API.get('/department/subdepartment');
export const getDepartmentById = (id) => API.get(`/department/${id}`);
export const getSubDepartmentById = (id) => API.get(`/department/subdepartment/${id}`);
export const updateDepartment = (id, formData) => API.put(`/department/${id}`, formData);
export const deleteDepartment = (id) => API.delete(`/department/${id}`);
export const updateSubDepartment = (subId, formData) => API.put(`/department/subdepartment/${subId}`, formData);
export const deleteSubDepartment = (id, subId) => API.delete(`/department/${id}/subdepartment/${subId}`);
 

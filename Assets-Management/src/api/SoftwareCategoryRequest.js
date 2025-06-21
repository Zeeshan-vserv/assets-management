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

//Software Name (Create Software)
export const createSoftware = (formData)=>API.post("/softwareName/")
export const getAllSoftware = () => API.get('/software');
export const getSoftwareById = (id) => API.get(`/software/${id}`);
export const updateSoftware = (id, updatedData) => API.put(`/software/${id}`, updatedData);
export const deleteSoftware = (id) => API.delete(`/software/${id}`);

//Software Category
export const createPublisher = (softwareId, formData) =>API.post(`/${softwareId}/publisher`, formData);
export const getAllPublisher = () => API.get('/publishers');
export const getPublisherById = (id) => API.get(`/publisher/${id}`);
export const updatePublisher = (id, updatedData) => API.put(`/publisher/${id}`, updatedData);
export const deletePublisher = (softwareId, publisherId) =>API.delete(`/${softwareId}/publisher/${publisherId}`);

//publisher
export const createSoftwareCategory = (softwareId, formData) =>API.post(`/${softwareId}/softwareCategory`, formData);
export const getAllSoftwareCategory = () => API.get('/softwareCategory');
export const getSoftwareCategoryById = (id) => API.get(`/softwareCategory/${id}`);
export const updateSoftwareCategory = (id, updatedData) =>API.put(`/softwareCategory/${id}`, updatedData);
export const deleteSoftwareCategory = (softwareId, softwareCategoryId) =>API.delete(`/${softwareId}/softwareCategory/${softwareCategoryId}`);
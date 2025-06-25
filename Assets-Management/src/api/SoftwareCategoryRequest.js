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

//Software 
export const createSoftware = (formData)=>API.post("/softwareName/",formData)
export const getAllSoftware = () => API.get('/softwareName/software');
export const getSoftwareById = (id) => API.get(`/softwareName/software/${id}`);
export const updateSoftware = (id, updatedData) => API.put(`/softwareName/software/${id}`, updatedData);
export const deleteSoftware = (id) => API.delete(`/softwareName/software/${id}`);

//publisher
export const createPublisher = (softwareId, formData) =>API.post(`/softwareName/${softwareId}/publisher`, formData);
export const getAllPublisher = () => API.get('/softwareName/publishers');
export const getPublisherById = (id) => API.get(`/softwareName/publisher/${id}`);
export const updatePublisher = (id, updatedData) => API.put(`/softwareName/publisher/${id}`, updatedData);
export const deletePublisher = (softwareId, publisherId) =>API.delete(`/softwareName/${softwareId}/publisher/${publisherId}`);

//Software Category
export const createSoftwareCategory = (softwareId, formData) =>API.post(`/softwareName/${softwareId}/softwareCategory`, formData);
export const getAllSoftwareCategory = () => API.get('/softwareName/softwareCategory');
export const getSoftwareCategoryById = (id) => API.get(`/softwareName/softwareCategory/${id}`);
export const updateSoftwareCategory = (id, updatedData) =>API.put(`/softwareName/softwareCategory/${id}`, updatedData);
export const deleteSoftwareCategory = (softwareId, softwareCategoryId) =>API.delete(`/softwareName/${softwareId}/softwareCategory/${softwareCategoryId}`);
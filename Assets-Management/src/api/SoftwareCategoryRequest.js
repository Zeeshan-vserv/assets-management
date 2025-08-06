import axios from 'axios';
import store from '../store/ReduxStore';
import { logout } from '../action/AuthAction';

const API = axios.create({ baseURL: 'http://localhost:5001' });

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

//Software 
export const createSoftware = (formData)=>API.post("/software",formData)
export const getAllSoftware = () => API.get('/software/');
export const getSoftwareById = (id) => API.get(`/software/${id}`);
export const updateSoftware = (id, updatedData) => API.put(`/software/${id}`, updatedData);
export const deleteSoftware = (id) => API.delete(`/software/${id}`);

//publisher
export const createPublisher = (formData) =>API.post(`/software/publisher`, formData);
export const getAllPublisher = () => API.get('/software/publisher');
export const getPublisherById = (id) => API.get(`/software/publisher/${id}`);
export const updatePublisher = (id, updatedData) => API.put(`/software/publisher/${id}`, updatedData);
export const deletePublisher = (publisherId) =>API.delete(`/software/publisher/${publisherId}`);

//Software Category
// export const createSoftwareCategory = (softwareId, formData) =>API.post(`/software/softwareCategory`, formData);
// export const getAllSoftwareCategory = () => API.get('/software/softwareCategory');
// export const getSoftwareCategoryById = (id) => API.get(`/software/softwareCategory/${id}`);
// export const updateSoftwareCategory = (id, updatedData) =>API.put(`/software/softwareCategory/${id}`, updatedData);
// export const deleteSoftwareCategory = (softwareId, softwareCategoryId) =>API.delete(`/software/softwareCategory/${softwareCategoryId}`);

export const createSoftwareCategory = (formData) => API.post(`/software/softwareCategory`, formData);
export const getAllSoftwareCategory = () => API.get('/software/softwareCategory');
export const getSoftwareCategoryById = (id) => API.get(`/software/softwareCategory/${id}`);
export const updateSoftwareCategory = (id, updatedData) => API.put(`/software/softwareCategory/${id}`, updatedData);
export const deleteSoftwareCategory = (softwareCategoryId) => API.delete(`/software/softwareCategory/${softwareCategoryId}`);
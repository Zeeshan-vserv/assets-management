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


// Auto Close Time
export const createAutoCloseTime = (formData)=>API.post("/globalIncident/autoCloseTime",formData)
export const getAllAutoCloseTimes = () => API.get('/globalIncident/autoCloseTime');
export const getAutoCloseTimeById = (id) => API.get(`/globalIncident/autoCloseTime/${id}`);
export const updateAutoCloseTime = (id, updatedData) => API.put(`/globalIncident/autoCloseTime/${id}`, updatedData);
export const deleteAutoCloseTime = (id) => API.delete(`/globalIncident/autoCloseTime/${id}`);


// Closure Code
export const createClosureCode = (formData)=>API.post("/globalIncident/closureCode",formData)
export const getAllClosureCodes = () => API.get('/globalIncident/closureCode');
export const getClosureCodeById = (id) => API.get(`/globalIncident/closureCode/${id}`);
export const updateClosureCode = (id, updatedData) => API.put(`/globalIncident/closureCode/${id}`, updatedData);
export const deleteClosureCode = (id) => API.delete(`/globalIncident/closureCode/${id}`);


// Predefined Replies
export const createPredefinedResponse = (formData)=>API.post("/globalIncident/predefinedResponse",formData)
export const getAllPredefinedResponses = () => API.get('/globalIncident/predefinedResponse');
export const getPredefinedResponseById = (id) => API.get(`/globalIncident/predefinedResponse/${id}`);
export const updatePredefinedResponse = (id, updatedData) => API.put(`/globalIncident/predefinedResponse/${id}`, updatedData);
export const deletePredefinedResponse = (id) => API.delete(`/globalIncident/predefinedResponse/${id}`);


// Pending Reasons
export const createPendingReason = (formData)=>API.post("/globalIncident/pendingReason",formData)
export const getAllPendingReasons = () => API.get('/globalIncident/pendingReason');
export const getPendingReasonById = (id) => API.get(`/globalIncident/pendingReason/${id}`);
export const updatePendingReason = (id, updatedData) => API.put(`/globalIncident/pendingReason/${id}`, updatedData);
export const deletePendingReason = (id) => API.delete(`/globalIncident/pendingReason/${id}`);


// Rules 
export const createRule = (formData)=>API.post("/globalIncident/rule",formData)
export const getAllRules = () => API.get('/globalIncident/rule');
export const getRuleById = (id) => API.get(`/globalIncident/rule/${id}`);
export const updateRule = (id, updatedData) => API.put(`/globalIncident/rule/${id}`, updatedData);
export const deleteRule = (id) => API.delete(`/globalIncident/rule/${id}`);

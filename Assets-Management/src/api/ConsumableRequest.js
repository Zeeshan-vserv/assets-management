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



//Consumable
export const createConsumable = (formData) => API.post('/consumable', formData);
export const getAllConsumables = ()=>API.get('/consumable')
export const updateConsumable = (id,updateData)=>API.put(`/consumable/${id}`,updateData)
export const getConsumableById = (id)=>API.get(`/consumable/${id}`)
export const deleteConsumable = (id)=>API.delete(`/consumable/${id}`)

//Sub-Consumable
export const addSubConsumable = (consumableId,subConsumableData)=>API.post(`/consumable/${consumableId}/subConsumable`,subConsumableData)
export const getAllSubConsumables = ()=>API.get('/consumable/subConsumable')
export const getSubConsumableById = (id)=>API.get(`/consumable/subConsumable/${id}`)
export const updateSubConsumable = (id, updateData)=>API.put(`/consumable/subConsumable/${id}`,updateData)
export const deleteSubConsumable =(consumableId, subConsumableId)=>API.delete(`/consumable/${consumableId}/subConsumable/${subConsumableId}`)
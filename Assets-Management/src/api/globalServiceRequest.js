import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });


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


// Auto Close Time

export const createAutoCloseTime = (formData) => API.post("/globalService/autoCloseTime", formData);
export const getAllAutoCloseTimes = () => API.get("/globalService/autoCloseTime");
export const getAutoCloseTimeById = (id) => API.get(`/globalService/autoCloseTime/${id}`);
export const updateAutoCloseTime = (id, formData) => API.put(`/globalService/autoCloseTime/${id}`, formData);
export const deleteAutoCloseTime = (id) => API.delete(`/globalService/autoCloseTime/${id}`);


//Support
export const createServiceCategory = (formData) => API.post('/globalService', formData);
export const getAllServiceCategory = () => API.get('/globalService')
export const updateServiceCategory = (id, updateData) => API.put(`/globalService/${id}`, updateData)
export const getServiceCategoryById = (id) => API.get(`/globalService/${id}`)
export const deleteServiceCategory = (id) => API.delete(`/globalService/${id}`)

//Support Group
export const addServiceSubCategory = (categoryId, subCategoryData) => API.post(`/globalService/${categoryId}/subCategory`, subCategoryData)
export const getAllServiceSubCategory = () => API.get('/globalService/subCategory')
export const getServiceSubCategoryById = (id) => API.get(`/globalService/subCategory/${id}`)
export const updateServiceSubCategory = (id, updateData) => API.put(`/globalService/subCategory/${id}`, updateData)
export const deleteServiceSubCategory = (categoryId, subCategoryId) =>
    API.delete(`/globalService/${categoryId}/subCategory/${subCategoryId}`);
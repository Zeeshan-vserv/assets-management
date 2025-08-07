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

  //Category
    export const createIncidentCategory = (formData) => API.post('/category', formData);
    export const getAllCategory = ()=>API.get('/category')
    export const updateCategory = (id,updateData)=>API.put(`/category/${id}`,updateData)
    export const getCategoryById = (id)=>API.get(`/category/${id}`)
    export const deleteCategory = (id)=>API.delete(`/category/${id}`)

//   Sub Category 
   export const addSubCategory = (categoryId,subCategoryData)=>API.post(`/category/${categoryId}/subCategory`,subCategoryData)
   export const getAllSubCategory = ()=>API.get('/category/subCategory')
   export const getSubCategoryById = (id)=>API.get(`/category/subCategory/${id}`)
   export const updateSubCategory = (id, updateData)=>API.put(`/category/subCategory/${id}`,updateData)
   export const deleteSubCategory =(categoryId, subCategoryData)=>API.delete(`/category/${categoryId}/subCategory/${subCategoryData}`)
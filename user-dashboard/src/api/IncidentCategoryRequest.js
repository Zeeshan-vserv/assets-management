import axios from 'axios'
import store from '../store2/ReduxStore2'
import { logout } from '../action2/AuthAction2';

const API = axios.create({ baseURL: 'http://localhost:5001' })

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      store.dispatch(logout());
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

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
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

// Asset API calls
export const createAsset = (formData) =>
  API.post('asset/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getAllAssets = () => API.get('asset/')

export const getAssetById = (id) => API.get(`asset/${id}`)

export const updateAsset = (id, formData) => API.put(`asset/${id}`, formData)

export const deleteAsset = (id) => API.delete(`asset/${id}`)

export const uploadAssetFromExcel = (formData) =>
  API.post('asset/upload-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

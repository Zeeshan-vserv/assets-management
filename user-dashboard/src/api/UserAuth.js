import axios from 'axios'
import { logout } from '../action2/AuthAction2'
import store from '../store2/ReduxStore2'

const API = axios.create({ baseURL: import.meta.env.VITE_API_KEY })

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

// export const signup = (formData) => API.post('auth/signup', formData)

export const login = (formData) => API.post('auth/login', formData)

export const getUser = (id) => API.get(`auth/${id}`)

export const getUserById = (id) => API.get(`auth/${id}`)

// export const updateUser = (id, formData) => API.put(`auth/${id}`, formData)

// export const deleteUser = (id) => API.delete(`auth/${id}`)

export const getAllUsers = () => API.get('auth/')

// export const uploadUsersFromExcel = (formData)=>API.post('/auth/upload-excel',formData)
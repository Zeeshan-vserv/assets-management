import axios from 'axios'
import store from '../store/ReduxStore'
import { logout } from '../action/AuthAction'

const API = axios.create({ baseURL: 'http://localhost:5001' })

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
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            store.dispatch(logout())
            window.location.href = '/auth' 
        }
        return Promise.reject(error)
    }
)

export const signup = (formData) => API.post('auth/signup', formData)
export const login = (formData) => API.post('auth/login', formData)
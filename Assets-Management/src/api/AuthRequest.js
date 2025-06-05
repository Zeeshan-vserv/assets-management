import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5001'})

export const signup = (formData) => API.post('auth/signup', formData)

export const login = (formData) => API.post('auth/login', formData)

export const getUser = (id) => API.get(`auth/${id}`)

export const updateUser = (id, formData) => API.put(`auth/${id}`, formData)

export const deleteUser = (id) => API.delete(`auth/${id}`)

export const getAllUsers = () => API.get('auth/')
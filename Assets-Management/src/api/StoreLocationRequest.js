import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });


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

export const createStoreLocation = (formData) => API.post("/storeLocation", formData);
export const getAllStoreLocations = () => API.get("/storeLocation");
export const getStoreLocationById = (id) => API.get(`/storeLocation/${id}`);
export const updateStoreLocation = (id, formData) => API.put(`/storeLocation/${id}`, formData);
export const deleteStoreLocation = (id) => API.delete(`/storeLocation/${id}`);
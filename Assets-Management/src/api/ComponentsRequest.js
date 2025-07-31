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

export const createComponent = (formData) => API.post("/component", formData);
export const getAllComponent = () => API.get("/component");
export const getComponentById = (id) => API.get(`/component/${id}`);
export const updateComponent = (id, formData) => API.put(`/component/${id}`, formData);
export const deleteComponent = (id) => API.delete(`/component/${id}`);

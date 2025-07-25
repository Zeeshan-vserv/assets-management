import axios from "axios";
import store from "../store/ReduxStore";
import { logout } from "../action/AuthAction";

const API = axios.create({ baseURL: "http://localhost:5001" });

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

//condition
export const createCondition = (formData) => API.post("/condition/", formData);
export const getAllConditions = () => API.get("/condition/");
export const getConditionById = (id) => API.get(`/condition/${id}`);
export const updateCondition = (id, updatedData) => API.put(`/condition/${id}`, updatedData);
export const deleteCondition = (id) => API.delete(`/condition/${id}`);

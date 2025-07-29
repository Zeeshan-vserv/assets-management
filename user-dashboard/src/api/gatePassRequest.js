import axios from "axios";
import store from "../store2/ReduxStore2";
import { UserLogout } from "../action2/AuthAction2";

const API = axios.create({ baseURL: "http://localhost:5001" });

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle token expiry or invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      store.dispatch(UserLogout());
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// export const createGatePassRequest = (formDatas) => API.post("/gatepass/", formDatas);
export const getMyPendingGatePassApprovals = () => API.get("/gatepass/my-approvals");
// export const getAllGatePassRequests = () => API.get("/gatepass/");
// export const getGatePassRequestById = (id) => API.get(`/gatepass/${id}`);
// export const updateGatePassRequest = (id, updateData) => API.put(`/gatepass/${id}`, updateData);
// export const deleteGatePassRequest = (id) => API.delete(`/gatepass/${id}`);


import axios from "axios";
import store from "../store/ReduxStore";
import { logout } from "../action/AuthAction";

const API = axios.create({ baseURL: "http://localhost:5001" });

// Attach token to every request
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

// Handle token expiry or invalid token
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

//SLA Creation
export const createSLA = (formData) => API.post("/sla/",formData);
export const getAllSLAs = () => API.get("/sla/");
export const getSLAById = (id) => API.get(`/sla/${id}`);
export const updateSLA = (id, updatedData) => API.put(`/sla/${id}`,updatedData);
export const deleteSLA = (id)=>API.delete(`/sla/${id}`)

//SLA Mapping
export const createSLAMapping = (formData) => API.post("/sla/slaMapping", formData);
export const getAllSLAMappings = () => API.get("/sla/slaMapping");
export const getSLAMappingById = (id) => API.get(`/sla/slaMapping/${id}`);
export const updateSLAMapping = (id, updatedData) => API.put(`/sla/slaMapping/${id}`, updatedData);
export const deleteSLAMapping = (id)=>API.delete(`/sla/slaMapping/${id}`)

//SLA Timelines
export const createSLATimeline = (formData)=>API.post("/sla/slaTimeline",formData)
export const getAllSLATimelines = ()=>API.get("/sla/slaTimeline")
export const getSLATimelineById = (id)=>API.get(`/sla/slaTimeline/${id}`)
export const updateSLATimeline = (id,updatedData)=>API.put(`/sla/slaTimeline/${id}`,updatedData)
export const deleteSLATimeline = (id)=>API.delete(`/sla/slaTimeline/${id}`)

//Priority Matrix
export const createPriorityMatrix = (formData)=>API.post("/sla/priorityMatrix",formData)
export const getAllPriorityMatrices = ()=>API.get("/sla/priorityMatrix")
export const getPriorityMatrixById = (id)=>API.get(`/sla/priorityMatrix/${id}`)
export const updatePriorityMatrix = (id,updatedData)=>API.put(`/sla/priorityMatrix/${id}`,updatedData)
export const deletePriorityMatrix = (id)=>API.delete(`/sla/priorityMatrix/${id}`)

//Holiday Calenar
export const createHolidayCalender = (formData)=>API.post("/sla/holidayCalender",formData)
export const getAllHolidayCalender = ()=>API.get("/sla/holidayCalender")
export const getHolidayCalenderById = (id)=>API.get(`sla/holidayCalender/${id}`)
export const updateHolidayCalender = (id,updatedData)=>API.put(`sla/holidayCalender/${id}`,updatedData)
export const deleteHolidayCalender = (id)=>API.delete(`sla/holidayCalender/${id}`)

//Holiday List
export const createHolidayList = (formData)=>API.post("/sla/holidayList",formData)
export const getAllHolidayList = ()=>API.get("/sla/holidayList")
export const getHolidayListById = (id)=>API.get(`/sla/holidayList/${id}`)
export const updateHolidayList = (id,updatedData)=>API.put(`sla/holidayList/${id}`,updatedData)
export const deleteHolidayList = (id)=>API.delete(`sla/holidayList/${id}`)

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
        if (error.response && error.response.status === 401) {
            store.dispatch(logout())
            window.location.href = '/auth' 
        } else if (error.response && error.response.status === 403) {
            window.location.href = '/not-authorized';
        }
        return Promise.reject(error)
    }
)

// Incident Dashboard Requests
export const getTechnicianIncidentStatusSummary = () =>
  API.get('/dashboard/technician-incident-status-summary');

export const getTotalIncidentsBar = (from, to, groupBy = "day") =>
  API.get('/dashboard/total-incidents-bar', {
    params: { from, to, groupBy }
  });

export const getOpenIncidentsByStatus = (from, to) =>
  API.get('/dashboard/open-incidents-by-status', {
    params: { from, to }
  });

export const getOpenIncidentsBySeverity = (from, to) =>
  API.get('/dashboard/open-incidents-by-severity', {
    params: { from, to }
  });

export const getResponseSlaStatus = (from, to) =>
  API.get('/dashboard/response-sla-status', {
    params: { from, to }
  });

export const getResolutionSlaStatus = (from, to) =>
  API.get('/dashboard/resolution-sla-status', {
    params: { from, to }
  });

  export const getIncidentOpenClosedByField = (groupBy, from, to) =>
  API.get('/dashboard/incident-open-closed-by-field', {
    params: { groupBy, from, to }
  });

  // Service Request Dashboard Requests
  export const getServiceRequestStatusSummary = () =>
  API.get('/dashboard/service-request-status-summary');

  export const getTotalServices = (from, to, groupBy = "day") =>
  API.get('/dashboard/total-services-bar', {
    params: { from, to, groupBy }
  });

  // Assets Dashboard Requests
export const getAssetsByStatus = () =>
  API.get('/dashboard/assets-by-status');

export const getAssetsBySupportType = () =>
  API.get('/dashboard/assets-by-support-type');

export const getAssetsByWarrantyExpiry = () =>
  API.get('/dashboard/assets-by-warranty-expiry');

export const getAssetsByCategory = () =>  
  API.get('/dashboard/assets-by-category');

export const getAssetsByLocation = () =>
  API.get('/dashboard/assets-by-location');

export const getAssetsBySubLocation = () =>
  API.get('/dashboard/assets-by-sub-location');

export const exportIncidentReport = (data) =>
  API.post('/dashboard/incidentsReport', data, {
    responseType: 'blob', 
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const exportServiceRequestReport = (data) =>
  API.post('/dashboard/service-requests', data, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const exportAssetReport = (data) =>
  API.post('/dashboard/assets', data, {
    responseType: 'blob', 
    headers: {
      'Content-Type': 'application/json'
    }
  });


import axios from "axios";

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Only log out on 401
      localStorage.clear();
      window.location = '/auth';
    } else if (error.response && error.response.status === 403) {
      // Show not authorized page on 403
      window.location = '/not-authorized';
    }
    return Promise.reject(error);
  }
);

export default axios;
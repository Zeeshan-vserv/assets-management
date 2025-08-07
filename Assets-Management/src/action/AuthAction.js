import * as AuthApi from '../api/AuthRequest.js'
import axios from "axios";

// Login action
export const login = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.login(formData);
    dispatch({
      type: "AUTH_SUCCESS",
      data: {
        token: data.token,
        userId: data.user._id,
        userRole: data.user.userRole,
        emailAddress: data.user.emailAddress,
        // ...add other fields you need for permissions
        ...data.user
      }
    });

    // Fetch permissions after successful login
    dispatch(fetchPermissions(data.token));
    return { success: true, message: "Login successful" };
    // Navigate in your component after dispatching login
    if (navigate) navigate(data.redirectTo || "/dashboardAsset", { replace: true });
  } catch (error) {
    dispatch({
      type: "AUTH_FAIL",
      error: error.response ? error.response.data.message : "An error occurred",
    });
    return { success: false, message: error.response?.data?.message || "Invalid credentials" };
  }
};

// Fetch permissions from backend
export const fetchPermissions = (token) => async (dispatch) => {
  const { data } = await axios.get("/access/permissions", {
    headers: { Authorization: `Bearer ${token}` }
  });
  dispatch({ type: "SET_PERMISSIONS", data: data.permissions });
};

export const logout = () => async(dispatch) => {
  dispatch({type: "LOG_OUT"});
}
import { useNavigate } from "react-router-dom";
// import * as AuthApi from '../api/AuthRequest.js'
import * as AuthApi from '../api/UserAuth.js'

export const login = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.login(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    // Do NOT use useNavigate here!
    // Return data so the component can handle navigation
    return { success: true, data };
  } catch (error) {
    dispatch({
      type: "AUTH_FAIL",
      error: error.response ? error.response.data.message : "An error occurred",
    });
    return { success: false, error: error.response ? error.response.data.message : "An error occurred" };
  }
};

export const UserLogout = () => async(dispatch) => {
  dispatch({type: "LOG_OUT"});
}
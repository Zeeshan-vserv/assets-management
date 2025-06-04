import { useNavigate } from "react-router-dom";
import * as AuthApi from '../api/AuthRequest.js'

export const login = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.login(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    const navigate = useNavigate();
    navigate(data.redirectTo || "/dashboardAsset", { replace: true });
  } catch (error) {
    // console.log(error);
    dispatch({
      type: "AUTH_FAIL",
      error: error.response ? error.response.data.message : "An error occurred",
    });
  }
};


export const logout = () => async(dispatch) => {
  dispatch({type: "LOG_OUT"});
}
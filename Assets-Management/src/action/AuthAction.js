import { useNavigate } from "react-router-dom"
import * as AuthApi from "../api/AuthRequest"

export const signup = (formData) => async (dispatch) => {
    dispatch({ type: "AUTH_START"})
    try{
        const { data} = await AuthApi.signup(formData)
        dispatch({ type: "AUTH_SUCCESS", data: data})
        const navigate = useNavigate()
        navigate(data.redirectTo || '/addUser', { replace: true})
    }
    catch(error){
        dispatch({ type: "AUTH_FAI", 
            error: error.response ? error.response.data.message: "An error occurred"})
    }
}

export const login = (formData) => async (dispatch) => {
    dispatch({ type: "AUTH_START"})
    try{
        const { data} = await AuthApi.login(formData)
        dispatch({ type: "AUTH_SUCCESS", data: data})
        const navigate = useNavigate()
        navigate(data.redirectTo || '/asset', { replace: true})
    }
    catch(error){
        dispatch({ type: "AUTH_FAI", 
            error: error.response? error.response.data.message: "An error occurred"})
    }
}

export const logout = () => async(dispatch) => {
    dispatch({ type: "LOG_OUT"})
}

const authReducer = (state = { authData: null, loading: false, error: false, updateLoading: false }, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, loading: true, error: false };
        case 'AUTH_SUCCESS':
            sessionStorage.setItem('token', action.data.token)
            sessionStorage.setItem('userId', action.data.user._id)
            return {
                ...state,
                authData: {
                    token: action.data.token,
                    userId: action.data.user._id
                },
                loading: false,
                error: false
            };
        case 'AUTH_FAIL':
            return { ...state, loading: false, error: true };
        case "UPDATING_START":
            return { ...state, updateLoading: true, error: false }
        case "UPDATING_SUCCESS":
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data, updateLoading: false, error: false };
        case "UPDATING_FAIL":
            return { ...state, updateLoading: false, error: true };
        case "LOG_OUT":
            localStorage.clear();
            return { ...state, authData: null, loading: false, error: false, updateLoading: false }
        default:
            return state;
    }
}

export default authReducer
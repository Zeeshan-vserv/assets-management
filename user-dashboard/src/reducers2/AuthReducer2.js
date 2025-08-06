const initialState = {
    authData: null,
    permissions: {},
    loading: false,
    error: false,
    updateLoading: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, loading: true, error: false };
        case 'AUTH_SUCCESS':
            localStorage.setItem('token', action.data.token)
            localStorage.setItem('userId', action.data.userId)
            return {
                ...state,
                authData: action.data, // all user fields in Redux
                loading: false,
                error: false
            };
        case 'SET_PERMISSIONS':
            return {
                ...state,
                permissions: action.data // store backend permissions here
            };
        case 'AUTH_FAIL':
            return { ...state, loading: false, error: true };
        case "UPDATING_START":
            return { ...state, updateLoading: true, error: false }
        case "UPDATING_SUCCESS":
            return { ...state, authData: action.data, updateLoading: false, error: false };
        case "UPDATING_FAIL":
            return { ...state, updateLoading: false, error: true };
        case "LOG_OUT":
            localStorage.clear();
            return { ...initialState }
        default:
            return state;
    }
}

export default authReducer
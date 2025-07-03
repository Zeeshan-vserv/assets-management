import {
    legacy_createStore as createStore,
    applyMiddleware, compose
} from 'redux'
import { thunk } from 'redux-thunk'
import { reducers } from '../reducers2/index2'

// Save token and userId to localStorage
function saveAuthToLocalStorage(token, userId) {
    try {
        window.localStorage.setItem("token", token)
        window.localStorage.setItem("userId", userId)
    } catch (err) {
        console.error("Error saving auth to local storage", err)
    }
}

function loadAuthFromLocalStorage() {
    try {
        const token = window.localStorage.getItem("token")
        const userId = window.localStorage.getItem("userId")
        if (token && userId) {
            return { token, userId }
        }
        return null
    } catch (err) {
        console.error("Error loading auth from local storage", err)
        return null
    }
}

const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose

const auth = loadAuthFromLocalStorage()
const persistedState = auth
    ? { authReducer: { authData: { token: auth.token, userId: auth.userId }, loading: false, error: false, updateLoading: false } }
    : undefined

const store = createStore(
    reducers, persistedState, composeEnhancers(applyMiddleware(thunk))
)

// Subscribe to store changes and save only the token and userId
store.subscribe(() => {
    const state = store.getState()
    const token = state.authReducer?.authData?.token
    const userId = state.authReducer?.authData?.userId
    if (token && userId) {
        saveAuthToLocalStorage(token, userId)
    } else {
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("userId")
    }
})

export default store;
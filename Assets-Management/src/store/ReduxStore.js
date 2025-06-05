import {
    legacy_createStore as createStore,
    applyMiddleware, compose
} from 'redux'
import { thunk } from 'redux-thunk'
import { reducers } from '../reducers'

// Only store/retrieve the JWT token
function saveTokenToLocalStorage(token) {
    try {
        window.localStorage.setItem("token", token)
    } catch (err) {
        console.error("Error saving token to local storage", err)
    }
}

function loadTokenFromLocalStorage() {
    try {
        return window.localStorage.getItem("token")
    } catch (err) {
        console.error("Error loading token from local storage", err)
        return null
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// Optionally, you can initialize authData from token if needed
const token = loadTokenFromLocalStorage()
const persistedState = token
    ? { authReducer: { authData: { token }, loading: false, error: false, updateLoading: false } }
    : undefined

const store = createStore(
    reducers, persistedState, composeEnhancers(applyMiddleware(thunk))
)

// Subscribe to store changes and save only the token
store.subscribe(() => {
    const state = store.getState()
    const token = state.authReducer?.authData?.token
    if (token) {
        saveTokenToLocalStorage(token)
    } else {
        window.localStorage.removeItem("token")
    }
})

export default store;
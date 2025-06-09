import {
    legacy_createStore as createStore,
    applyMiddleware, compose
} from 'redux'
import { thunk } from 'redux-thunk'
import { reducers } from '../reducers'

// Save token and userId to localStorage
function saveAuthToSessionStorage(token, userId) {
    try {
        window.sessionStorage.setItem("token", token)
        window.sessionStorage.setItem("userId", userId)
    } catch (err) {
        console.error("Error saving auth to session storage", err)
    }
}

function loadAuthFromSessionStorage() {
    try {
        const token = window.sessionStorage.getItem("token")
        const userId = window.sessionStorage.getItem("userId")
        if (token && userId) {
            return { token, userId }
        }
        return null
    } catch (err) {
        console.error("Error loading auth from session storage", err)
        return null
    }
}

const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose

const auth = loadAuthFromSessionStorage()
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
        saveAuthToSessionStorage(token, userId)
    } else {
        window.sessionStorage.removeItem("token")
        window.sessionStorage.removeItem("userId")
    }
})

export default store;
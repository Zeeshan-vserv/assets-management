import {
    legacy_createStore as createSrore,
    applyMiddleware, compose,
    createStore
} from 'redux'
import { thunk} from 'redux-thunk'
import { reducers } from '../reducers'

function saveToLocalStorage(store){
    try{
        const serializedStore = JSON.stringify(store)
        window.localStorage.setItem("store", serializedStore)
    }
    catch(err){
        console.error("Error saving to local storage", err)
    }
}

function loadFromLocalStorage(){
    try{
        const serializedStore = window.localStorage.getItem("store")
        if(serializedStore === null) return undefined
        return JSON.parse(serializedStore)
    }
    catch(err){
        console.error("Error loading from local storage", err)
        return undefined
    }
}

const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSIONS_COMPOSE__ || compose
const persistedState = loadFromLocalStorage()

const store = createStore(
    reducers, persistedState, composeEnhancers(applyMiddleware(thunk))
)

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store;
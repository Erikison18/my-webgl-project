import { combineReducers } from 'redux'

const numberInit = {
    number: 0
}
const number = (state = numberInit, action) => {
    switch (action.type) {
        case 'addCount':
            return { ...state, number: action.count + 1 }
        case 'reduceCount':
            return { ...state, number: action.count - 1 }
        default:
            return state
    }
}
const listInit = []
const list = (state = listInit, action) => {
    switch (action.type) {
        case 'getList':
            return action.payload
        default:
            return state
    }
}

export default combineReducers({
    number,
    list
})

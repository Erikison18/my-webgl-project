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

export default number;

const listInit = []
const list = (state = listInit, action) => {
    switch (action.type) {
        case 'getList':
            return action.payload
        default:
            return state
    }
}
export default list;
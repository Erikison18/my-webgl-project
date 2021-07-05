import { createStore, applyMiddleware, compose } from 'redux'
//处理redux的异步任务的中间件
import thunk from 'redux-thunk'
import reducer from './reducer'

const store = createStore(reducer, compose(
    applyMiddleware(thunk),
    // (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
))

export default store
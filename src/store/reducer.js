import { combineReducers } from 'redux';
import number from './reducer/number';
import list from './reducer/list';

export default combineReducers({
    number,
    list,
})

import { combineReducers } from 'redux';
import DBReducer from './DBReducer';

export default combineReducers({
    dataBase: DBReducer
});
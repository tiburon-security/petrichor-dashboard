import { combineReducers } from 'redux';
import { popupIsOpen, popupContent } from './PopupModal';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
	popupIsOpen,
	popupContent,
	routing: routerReducer
});
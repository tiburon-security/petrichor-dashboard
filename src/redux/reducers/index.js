import { combineReducers } from 'redux';
import { popupIsOpen, popupContent } from './PopupModal';

export default combineReducers({
	popupIsOpen,
	popupContent
});
import { combineReducers } from 'redux';
import { popupModal } from './PopupModal';
import { sidebar } from './SidebarMenu';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
	popupModal,
	sidebar,
	routing: routerReducer
});
import { combineReducers } from 'redux';
import { popupModal } from './PopupModal';
import { sidebar } from './SidebarMenu';
import { dashboard } from './Dashboard';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
	popupModal,
	sidebar,
	dashboard,
	routing: routerReducer
});
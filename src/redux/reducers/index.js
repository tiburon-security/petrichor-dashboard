import { combineReducers } from 'redux';
import { popupModal } from './PopupModal';
import { sidebar } from './SidebarMenu';
import { dashboard } from './Dashboard';

export default combineReducers({
	popupModal,
	sidebar,
	dashboard,
});
export function setSidebarFullsize(bool){
	return {
		type: 'SIDEBAR_SET_FULLSIZE',
		isFullSize: bool
	};
}

export function toggleSidebarSize(){
	return {
		type: 'SIDEBAR_TOGGLE',
	};
}

export function setOpenMenu(routeNameStr){
	return {
		type: 'SIDEBAR_OPEN_MENU',
		openMenu: routeNameStr 
	};
}
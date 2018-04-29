export function addDashboardWidget(id, x, y, w, h, component){
	return {
		type: 'DASHBOARD_WIDGET_ADD',
		id, 
		x, 
		y, 
		w, 
		h, 
		component
	};
}

export function removeDashboardWidget(id){
	return {
		type: 'DASHBOARD_WIDGET_REMOVE',
		id
	};
}

export function removeDashboardWidgetsAll(){
	return {
		type: 'DASHBOARD_WIDGET_REMOVE_ALL'
	};
}

export function setDashboardColumnNumber(numberOfColumns){
	return {
		type: 'DASHBOARD_NUMBER_OF_COLUMNS',
		numberOfColumns
	};
}

export function setDashboardRowHeight(rowHeight){
	return {
		type: 'DASHBOARD_ROW_HEIGHT',
		rowHeight
	};
}
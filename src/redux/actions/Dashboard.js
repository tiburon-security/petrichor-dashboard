export const INTERWIDGET_MESSAGE_TYPES = {
	
	START_DATE : "START_DATE",
	END_DATE : "END_DATE"
	
}

export function addDashboardWidget(id, x, y, w, h, isDraggable, isResizable, component){
	return {
		type: 'DASHBOARD_WIDGET_ADD',
		id, 
		x, 
		y, 
		w, 
		h,
		isDraggable,
		isResizable,
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

export function sendInterwidgetMessage(messageType, message){
	return {
		type: 'DASHBOARD_SEND_INTERWIDGET_MESSAGE',
		messageType,
		message
	};
}

/**
 * Expects messages in json array:
   [
	{
	  messageType: const,
	  message: string
	}
   ]
 */
export function sendMultipleInterwidgetMessages(messages){
	return {
		type: 'DASHBOARD_SEND_MULTIPLE_INTERWIDGET_MESSAGES',
		messages
	};
}
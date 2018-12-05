export const INTERWIDGET_MESSAGE_TYPES = {
	
	START_DATE : "START_DATE",
	END_DATE : "END_DATE",
	KEYWORD_SEARCH : "KEYWORD_SEARCH"
	
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

export function removeInterwidgetMessage(messageType){
	return {
		type: 'DASHBOARD_REMOVE_MULTIPLE_INTERWIDGET_MESSAGES',
		messageType
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

/**
 * Expects messagetypes in array or a single messageType:
   [
     messageType1,
	 messageType2,
	 ...
   ]
 */
export function removeMultipleInterwidgetMessages(messageTypes){
	return {
		type: 'DASHBOARD_REMOVE_MULTIPLE_INTERWIDGET_MESSAGES',
		messageTypes
	};
}
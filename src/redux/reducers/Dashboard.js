const initialState = {
  widgets: [],
  numberOfColumns: 4, 
  rowHeight: 100,
  widget_messages: {}
}

export function dashboard(state = initialState, action) {

	switch (action.type) {
			
			
		case 'DASHBOARD_WIDGET_ADD':
			return {
				...state,
				widgets: [...state.widgets, 
					{
						"id" : action.id,
						"x" : action.x,
						"y" : action.y,
						"w" : action.w,
						"h" : action.h,
						"isDraggable" : action.isDraggable,
						"isResizable" : action.isResizable,
						"component" : action.component
					}
				]
			}		
			
			
		case 'DASHBOARD_WIDGET_REMOVE':
			return {
				...state,
				widgets: state.widgets.filter(element => element.id !== action.id)
			}		
			
			
		case 'DASHBOARD_WIDGET_REMOVE_ALL':
			return {
				...state,
				widgets: []
			}

		
		case 'DASHBOARD_NUMBER_OF_COLUMNS':
			return {
				...state,
				"numberOfColumns" : action.numberOfColumns,
			}	
		
		
		case 'DASHBOARD_ROW_HEIGHT':
			return {
				...state,
				"rowHeight" : action.rowHeight,
			}			
			
		case 'DASHBOARD_SEND_INTERWIDGET_MESSAGE':
			return {
				...state,
				widget_messages: {
					...state.widget_messages,
					[action.messageType] : action.message,
				}
			}			
		
		case 'DASHBOARD_SEND_MULTIPLE_INTERWIDGET_MESSAGES':
		
			let updatedMessages = state.widget_messages;
			
			for(let i of action.messages){
				updatedMessages[i.messageType] = i.message;
			}
		
			return {
				...state,
				widget_messages: updatedMessages
			}	
			
			
			
		default:
			return state
	}
}
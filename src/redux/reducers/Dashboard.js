const initialState = {
  widgets: [],
  numberOfColumns: 4, 
  rowHeight: 100
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
		default:
			return state
	}
}
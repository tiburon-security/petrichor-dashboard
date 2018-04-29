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
						"component" : action.component
					}
				]
			}		
			
			
		case 'DASHBOARD_WIDGET_REMOVE':
			return {
				...state,
				widgets: [
					...state.widgets.slice(0, action.id),
					...state.widgets.slice(action.id + 1)
				]
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
		
		
		case 'DASHBOARD_WIDGET_ADD':
			return {
				...state,
				"rowHeight" : action.rowHeight,
			}	
		default:
			return state
	}
}
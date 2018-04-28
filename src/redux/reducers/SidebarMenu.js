const initialState = {
	isFullSize: true,
	openMenu: null
}

export function sidebar(state = initialState, action) {

	switch (action.type) {
		
		case 'SIDEBAR_SET_FULLSIZE':
			return {
				...state,
				isFullSize: action.isFullSize
			}		


		case 'SIDEBAR_TOGGLE':
			return {
				...state,
				isFullSize: !state.isFullSize
			}			
			
		case 'SIDEBAR_OPEN_MENU':
			return {
				...state,
				openMenu: action.openMenu
			}			

		default:
			return state
	}
}
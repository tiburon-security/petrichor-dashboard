const initialState = {
  isFullSize: true
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

		default:
			return state
	}
}
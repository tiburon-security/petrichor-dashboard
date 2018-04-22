const initialState = {
  isOpen: false,
  title: "Placeholder",
  body: "Placeholder"
}


export function popupModal(state = initialState, action) {

	switch (action.type) {
		
		case 'POPUP_MODAL_OPEN':
			return {
				...state,
				"isOpen" : action.isOpen
			}
			
		case 'POPUP_MODAL_ADD_DATA':
			return {
				...state,
				"title" : action.title,
				"body" : action.body
			}

		default:
			return state
	}
}
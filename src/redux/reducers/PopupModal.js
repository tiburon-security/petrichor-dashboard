export function popupIsOpen(state = false, action) {

	switch (action.type) {
		case 'POPUP_MODAL_IS_OPEN':
			return action.isOpen

		default:
			return state
	}
}

export function popupContent(state = 
	{
		"title" : "Placeholder", 
		"body" : "Placeholder"
	}, action) {

	switch (action.type) {
		case 'POPUP_MODAL_ADD_DATA':
			return {
				"title" : action.title,
				"body" : action.body
			}

		default:
			return state
	}
}
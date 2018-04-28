export function popupIsOpenAction(bool){
	return {
		type: 'POPUP_MODAL_OPEN',
		isOpen: bool
	};
}

export function addPopupContentAction(title, body){
	return {
		type: 'POPUP_MODAL_ADD_DATA',
		title,
		body
	};
}

/**
 * Action Creator for opening popup with a given title and body
 */
export function openPopupModal(title, body){
	return (dispatch) => {
		dispatch(popupIsOpenAction(true));
		dispatch(addPopupContentAction(title, body));
		
	}
}


/**
 * Action Creator for closing a popup and clearing the title and body
 */
export function closePopupModal(){
	return (dispatch) => {
		dispatch(popupIsOpenAction(false));
		dispatch(addPopupContentAction(null, null));
	}
}
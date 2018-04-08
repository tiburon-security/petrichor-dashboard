export function popupIsOpenAction(bool){
	console.log("weeee")
	console.log(bool)
	return {
		type: 'POPUP_MODAL_IS_OPEN',
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
		dispatch(addPopupContentAction(title, body));
		dispatch(popupIsOpenAction(true));
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
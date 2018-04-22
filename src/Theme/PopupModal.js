import React, { Component } from 'react';
import { connect } from 'react-redux';
import { openPopupModal, closePopupModal } from '../redux/actions/PopupModal.js';
import { Modal, Button } from 'react-bootstrap';

class PopupModal extends Component {
	
	render(){
		
		return (
			<div className="static-modal">
			<Modal show={this.props.isOpen} >
					<Modal.Header>
						<Modal.Title>{this.props.title}</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						{this.props.body}
					</Modal.Body>

					<Modal.Footer>
					<Button onClick={() => this.props.closePopupModal()}>Close</Button>
					</Modal.Footer>

				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.popupModal.isOpen,
		title : state.popupModal.title,
		body : state.popupModal.body
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openPopupModal: (title, body) => dispatch(openPopupModal(title,body)),
        closePopupModal: () => dispatch(closePopupModal())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupModal);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { openPopupModal, closePopupModal } from '../redux/actions/PopupModal.js';
import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';

const Title = styled.div`
	font-weight: 500;
    margin: 0;
    line-height: 1.42857143;
	font-size: 18px;
`;

class PopupModal extends Component {
	
	render(){
		return (
			<Modal show={this.props.isOpen} >
				<Modal.Header>
					<Title>{this.props.title}</Title>
				</Modal.Header>

				<Modal.Body>
					{this.props.body}
				</Modal.Body>

				<Modal.Footer>
					<Button 
						size="sm"
						variant="outline-dark"
						onClick={() => this.props.closePopupModal()}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
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
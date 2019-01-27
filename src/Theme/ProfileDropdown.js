import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';

// Button for opening dropdown menu
const DropdownToggle = styled.button`
	border: none;
	cursor: pointer;
	background: none;
`;


/**
 * Component that shows profile dropdown in the toolbar
 */
class ProfileDropdown extends Component {
	
	static propTypes = {
		user_name : PropTypes.string,		
	}
	
	static defaultProps = {
		user_name: "Unknown",
	}
	
	
	render() { 
	
		let title = (
			<span>
				<i className="fa fa-user"></i>
				{" "}
				{this.props.user_name}
			</span>
		)
	
		return (
		
			<Dropdown id="ProfileDropdown">
				<DropdownToggle bsRole="toggle">{title}</DropdownToggle>
				<Dropdown.Menu>
					
					<MenuItem eventKey={4.1}>Profile</MenuItem>
					<MenuItem eventKey={4.2}>                      
						<span className="badge bg-red pull-right">50%</span>
						<span>Settings</span>
					</MenuItem>
					<MenuItem divider />
					<MenuItem eventKey={4.3}>Help</MenuItem>
					<MenuItem eventKey={4.4}><i className="fa fa-sign-out pull-right"></i> Log Out</MenuItem>
				</Dropdown.Menu>
			</Dropdown>
		);
	}
}

export default ProfileDropdown;
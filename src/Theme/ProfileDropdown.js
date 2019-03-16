import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// Button for opening dropdown menu
const DropdownToggle = styled.button`
	height:57px;
	padding: 0 15px;
	border: none;
	cursor: pointer;
	background: none;
	color: #515356;
	
	:focus {
		outline: none;
	}
	
	:after {
		display:none;
	}
`;

// Adds styles to react-bootstrap Dropdown menu
const CustomDropDownMenu = styled.div`
	top:-3px !important;
	border: 1px solid #D9DEE4;
	border-radius:0;
`;

// Adds styles to react-bootstrap Dropdown item
const CustomMenuItem = styled(Dropdown.Item)`	
	font-size: 14px;
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857143;
    color: #333;
    white-space: nowrap;
	
	:hover {
	    color: #262626;
		text-decoration: none;
		background-color: #f5f5f5;
	}
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
				<FontAwesomeIcon icon="user" />
				{" "}
				{this.props.user_name}
			</span>
		)
	
		return (
		
			<Dropdown >
				<Dropdown.Toggle as={DropdownToggle}>{title}</Dropdown.Toggle>
				<Dropdown.Menu as={CustomDropDownMenu} alignRight={true}>
					<CustomMenuItem eventKey={4.1}>Profile</CustomMenuItem>
					<CustomMenuItem eventKey={4.2}>                      
						<span>Settings</span>
						<span className="badge badge-pill badge-danger pull-right">50%</span>
					</CustomMenuItem>
					<Dropdown.Divider />
					<CustomMenuItem eventKey={4.3}>Help</CustomMenuItem>
					<CustomMenuItem eventKey={4.4}>
						<FontAwesomeIcon icon="sign-out-alt" className="pull-right" /> Log Out
					</CustomMenuItem>
				</Dropdown.Menu>
			</Dropdown>
		);
	}
}

export default ProfileDropdown;
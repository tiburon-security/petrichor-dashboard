import React, { Component } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

/**
 * Component that shows profile dropdown in the toolbar
 */
class ProfileDropdown extends Component {
	
	propTypes: {
		user_name : React.PropTypes.string,		
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
		
			<NavDropdown eventKey={4} title={title} id="basic-nav-dropdown" >
				<MenuItem eventKey={4.1}>Profile</MenuItem>
				<MenuItem eventKey={4.2}>                      
					<span className="badge bg-red pull-right">50%</span>
					<span>Settings</span>
				</MenuItem>
				<MenuItem divider />
				<MenuItem eventKey={4.3}>Help</MenuItem>
				<MenuItem eventKey={4.4}><i className="fa fa-sign-out pull-right"></i> Log Out</MenuItem>
			</NavDropdown>


   
		);
	}
}

export default ProfileDropdown;
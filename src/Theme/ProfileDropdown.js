import React, { Component } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

/**
 * Component that shows profile dropdown in the toolbar
 */
class ProfileDropdown extends Component {
	
	propTypes: {
		image_path    : React.PropTypes.string,
		user_name : React.PropTypes.string,		
	}
	
	static defaultProps = {
		user_name: "Unknown",
	}
	
	
	render() { 
	
		return (
		
			<NavDropdown eventKey={4} title={this.props.user_name} id="basic-nav-dropdown" >
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
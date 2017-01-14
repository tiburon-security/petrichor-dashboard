import React, { Component } from 'react';

/**
 * Component that shows notifications in the toolbar
 */
class ProfileDropdown extends Component {
	
	constructor(props) {
		super(props);
		this.state = {menu_open: false};
	}
	
	/**
	 * Open/close the notification dropdown menu
	 */
	toggleMenuOpen(){
		this.setState({menu_open:!this.state.menu_open});
	}
	
	render() {                
		return (

				<li className={(this.state.menu_open ? 'open' : '')} onBlur={() => this.setState({menu_open : false})}>
                  <a href="#" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false" onClick={this.toggleMenuOpen.bind(this)}>
                    <img src="images/img.jpg" alt="John"/>John Doe
                    <span className=" fa fa-angle-down"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-usermenu pull-right">
                    <li><a href="#"> Profile</a></li>
                    <li>
                      <a href="#">
                        <span className="badge bg-red pull-right">50%</span>
                        <span>Settings</span>
                      </a>
                    </li>
                    <li><a href="#">Help</a></li>
                    <li><a href="login.html"><i className="fa fa-sign-out pull-right"></i> Log Out</a></li>
                  </ul>
                </li>
   
		);
	}
}

export default ProfileDropdown;
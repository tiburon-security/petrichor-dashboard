import React, { Component } from 'react';

/**
 * Component that shows notifications in the toolbar
 */
class ProfileDropdown extends Component {
	
	constructor(props) {
		super(props);
		this.state = {menu_open: false};
	}
	
	propTypes: {
		image_path    : React.PropTypes.string.isRequired,
		user_name : React.PropTypes.bool.isRequired,
	}
	
	static defaultProps = {
		user_name: "Unknown"	
	}
	
	/**
	 * Open/close the notification dropdown menu
	 */
	toggleMenuOpen(){
		this.setState({menu_open:!this.state.menu_open});
	}
	
	render() { 

		var profilePic = (this.props.image_path ?  <img src={this.props.image_path} alt="Profile Picture"/> : <i className="fa fa-user"></i>);
	
		return (

				<li className={(this.state.menu_open ? 'open' : '')} onBlur={() => this.setState({menu_open : false})}>
                  <a href="#" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false" onClick={this.toggleMenuOpen.bind(this)}>
					  {profilePic} {this.props.user_name}
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
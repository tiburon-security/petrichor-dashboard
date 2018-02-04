import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, Navbar } from 'react-bootstrap';

class TopNavigation extends Component {
	
	propTypes: {
		onClick    : PropTypes.func.isRequired,
		menuFullsize : PropTypes.bool.isRequired
	}
	
	constructor(props){
		super(props);
		
		this.state = {
			window_width: window.innerWidth
		}
	}

	
	render() {
		 
		let menuStyles = {
			marginLeft 		: (this.props.menuFullsize ? "230px" : "70px" ),
			marginBottom	: "0px",
			height			: "57px",
			background		: "#EDEDED",
			borderBottom	: "1px solid #D9DEE4",
			borderRadius	: "0px"
		}
		
		return (
            
			<Navbar id='top-navbar' fluid={true} style={menuStyles}>
				<Navbar.Header>
					<Navbar.Brand>
						<div className="nav2 toggle">
							<a id="menu_toggle" onClick={this.props.onClick}><i className="fa fa-bars"></i></a>
						</div>
					</Navbar.Brand>
		
				</Navbar.Header>

				<Nav pullRight>
					{this.props.children}
				</Nav>

			</Navbar>
		
		);
	}
}

export default TopNavigation;

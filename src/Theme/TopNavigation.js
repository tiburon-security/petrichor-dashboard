import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { toggleSidebarSize } from '../redux/actions/SidebarMenu.js';
import { connect } from 'react-redux';

class TopNavigation extends Component {
	
	render() {
		 
		let menuStyles = {
			marginLeft 		: (this.props.sidebar_menu_is_fullsize ? "230px" : "70px" ),
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
							<a id="menu_toggle" onClick={()=>{this.props.toggleSidebarSize()}}><i className="fa fa-bars"></i></a>
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

const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleSidebarSize: () => dispatch(toggleSidebarSize())		
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigation);

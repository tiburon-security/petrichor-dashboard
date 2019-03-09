import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import MenuLink from './MenuLink';
import { connect } from 'react-redux';
import { setOpenMenu } from '../redux/actions/SidebarMenu.js';
import styled from 'styled-components';

/**
 * Complete reimplementation of Gentella's Sidebar menu functionality from jQuery to React. 
 * Includes abstractions of DOM elements for ease of use:
 *
 * <SidebarMenu>
 *	<MenuItem>
 *		<MenuLink/>
 *	</MenuItem>
 * </SidebarMenu>
 *
 */
 
 
const SideMenuList = styled.ul`
    margin-top: 10px;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none; 
`;

const Heading = styled.h3`
	${props => (!props.sidebar_menu_is_fullsize && 'display:none;')};

	padding-left: 23px;
	color: #fff;
	text-transform: uppercase;
	letter-spacing: .5px;
	font-weight: 700;
	font-size: 11px;
	margin-bottom: 0;
	margin-top: 0;
	text-shadow: 1px 1px #000;
`;
 
 
/**
 * Dynamically generates SidebardMenu component corresponding to application routes defined in
 * routes_menu_config
 */
class DynamicSidebarMenu extends Component {
	
	constructor(props){
		super(props);
		
		// Open menu corresponding to active route, if the menu is full size
		if(this.props.sidebar_menu_is_fullsize && this.props.currentOpenMenu === null){
			this.props.openMenu(this.props.route_name)
		}
		
	}
	
	static propTypes = {
		config : PropTypes.object.isRequired,
	}
	
	
	/**
	 * Minimizes any submenus if the menu is small and the user clicks out of the menu
	 *
	 */
	contextSwitchHandler(event){

		if(!this.props.sidebar_menu_is_fullsize){
			this.props.openMenu(null)
		}
		
	} 
	
	/**
	 * If the menu is large and is then minimized but a submenu was previously open, close it.
	 * Similarly, if it is small but then maximized, open menu to corresponding active route
	 */
	componentDidUpdate(prevProps, prevState){
		
		if(prevProps.sidebar_menu_is_fullsize && !this.props.sidebar_menu_is_fullsize){
			this.props.openMenu(null);
		}		
		
		if(!prevProps.sidebar_menu_is_fullsize && this.props.sidebar_menu_is_fullsize){
			this.props.openMenu(this.props.route_name);
		}

	}
	
	render() {
		let menu = [];
		let uniqueKey = 0;
		let allRoutes = this.props.config.routes;
		
		// Iteate every top level route
		for (let topLevelRoute of allRoutes) {
			
			// Holds the child url components
			let children = [];
			
			if(topLevelRoute.visible_in_menu === true) {
				
				var currentlyActive = false;
				var topLevelLink = (topLevelRoute.link ? topLevelRoute.link : topLevelRoute.route);
		
				// If the menu item has a submenu
				if(topLevelRoute.routes !== null && "routes" in topLevelRoute ){
			
					// Iterate every child route
					for (let childRoute of topLevelRoute.routes) {

						if(childRoute.visible_in_menu === true){
							uniqueKey++;
							
							var childLink = (childRoute.link ? childRoute.link : childRoute.route);
							
							// Generate URL component
							var path = topLevelLink + "" + childLink
							children.push(<MenuLink key={uniqueKey} title={childRoute.menu_title} url={path} />)
							
							// Determine whether child is the currently active route
							if(this.props.currentOpenMenu === childRoute.route_name){
								currentlyActive = true;
							}
							
						}
					}
					
				}
				
				// Determine whether parent is the currently active route
				if(this.props.currentOpenMenu === topLevelRoute.route_name){
					currentlyActive = true;
				}
				
				
				uniqueKey++;
				
				// Generate menu heading component
				let menuItem = <MenuItem 
									key={uniqueKey} 
									name={topLevelRoute.route_name} 
									title={topLevelRoute.menu_title} 
									url={topLevelLink} 
									active={currentlyActive} 
									icon={topLevelRoute.menu_font_awesome_icon} 
									children={children} 
								/>;
								
				menu.push(menuItem);
			
			}
			
		}
		
		return (
			<div tabIndex="0" onBlur={()=>{	this.contextSwitchHandler();}}>
				<Heading sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>General</Heading>
				<SideMenuList>
					{menu}
				</SideMenuList>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
    return {
        currentOpenMenu: state.sidebar.openMenu,
        sidebar_menu_is_fullsize: state.sidebar.isFullSize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openMenu: (str) => dispatch(setOpenMenu(str)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DynamicSidebarMenu));
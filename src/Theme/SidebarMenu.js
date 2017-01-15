import React, { Component } from 'react';
import { Link } from 'react-router';

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

 
 /* TODO:
 
 - mimick jquery slideup, slidedown animations when menu item with children links clicked
 
 */
 
 
/**
 * Represents the link under a menu heading
 */
class MenuLink extends Component {
	
	propTypes: {
		title : React.PropTypes.string.isRequired,
		url   : React.PropTypes.string.isRequired,
	}
	
	render(){
		return (
			<li><Link to={this.props.url}>{this.props.title}</Link></li>
		
		)
	}
}


/**
 * Represents a top level menu heading/URL
 */
class MenuItem extends Component {
	
	constructor(props) {
		super(props);
		this.state = {submenuOpen: false};
	}
	
	propTypes: {
		title    : React.PropTypes.string.isRequired,
		active : React.PropTypes.bool.isRequired,
		icon : React.PropTypes.string,
		url : React.PropTypes.string
	}
	
	openSubmenu(e){		
		this.props.linkClicked(this.props.title);		
	}
	
	render(){
		
		// Determine if there are any child elements
		let hasChildren = (this.props.children !== undefined && this.props.children.length > 0);
		
		return (
			<li className={(this.props.active === true ? 'active' : null)}>
				<a href={(!hasChildren && this.props.url != null ? this.props.url : "#")} onClick={this.openSubmenu.bind(this)}>
				
					{/* Add Glypicon if one is supplied */}
					{this.props.icon ? <i className={this.props.icon}></i> : null}
					
					{this.props.title}
					
					{/* Add down chevron if there are subitems */}
					{hasChildren ? <span className="fa fa-chevron-down"></span> : null}
				
				</a>
				
				{/* Add submenu URLs if there are any */}
				{hasChildren ? <ul className="nav child_menu" style={(this.props.active === true ? {'display' : 'block'} : {'display':'none'})}>{this.props.children}</ul> : null}
					
				
			</li>
		
		)
	}
}


/**
 * Represents a sidebar menu consisting of top-level MenuItems
 */
class SidebarMenu extends Component {
	
	constructor(props){
		super(props);
		this.state = {childrenElements: null};
	}
	
	/**
	 * Ensures that only the most recently opened submenu is marked as 'active' 
	 */
	submenuOpened(key){
		
		// React.map version of ES6 map doesn't allow context to be passed in...
		let self = this;
		
		// Iterate all children nodes
		let childrenElements = React.Children.map(this.props.children, function (c, index) {
			
			// Determine if it's the one that was just opened
			let newlyOpened = (c.props.title === key ? true : false);
			
			let props = {
				active : newlyOpened,
				linkClicked: self.submenuOpened.bind(self)
			};
			
			// Set to active if its the one that was just opened
			return React.cloneElement(c, props);
		});
		
		// Update DOM
		this.setState({childrenElements : childrenElements});
			
	}
	
	componentDidMount(){
					
			// React.map version of ES6 map doesn't allow context to be passed in...
		    let self = this;
			
			// Modify children element's to trigger submenuOpened() when clicked
			let childrenElements = React.Children.map(this.props.children, function (c, index) {
				return React.cloneElement(c, {                    
					linkClicked: self.submenuOpened.bind(self)
				});
			});
			
			this.setState({childrenElements: childrenElements});
		
	}
	
	render(){
		
		return (
			<div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
				<div className="menu_section">
					<h3>General</h3>
					<ul id="sidebard-menu-data" className="nav side-menu">
						{this.state.childrenElements}
					</ul>

				</div>

			</div>
		
		)
	}
}


/**
 * Dynamically generates SidebardMenu component corresponding to application routes defined in
 * routes_menu_config
 */
class DynamicSidebarMenu extends Component {
	
	render() {
		let currentRoute = this.props.current_route;
		let menu = [];
		let uniqueKey = 0;
		let allRoutes = window.app_config.routes;
		
		menu.push(<MenuItem key="256" title={window.app_config.index_route.menu_title} onClick={this.resetMenu} url="/" icon={window.app_config.index_route.menu_font_awesome_icon} />);

		
		// Iteate every top level route
		for (let topLevelRoute of allRoutes) {
			
			// Holds the child url components
			let children = [];
			
			if(topLevelRoute.visible_in_menu === true) {
				
				var currentlyActive = false;
				var topLevelLink = (topLevelRoute.link ? topLevelRoute.link : topLevelRoute.route);
		
				// If the menu item has a submenu
				if(topLevelRoute.child_routes !== null){
			
					// Iterate every child route
					for (let childRoute of topLevelRoute.child_routes) {

						if(childRoute.visible_in_menu === true){
							uniqueKey++;
							
							var childLink = (childRoute.link ? childRoute.link : childRoute.route);
							
							// Generate URL component
							var path = topLevelLink + "" + childLink
							children.push(<MenuLink key={uniqueKey} title={childRoute.menu_title} url={path} />)
							
							// Determine whether child is the currently active route
							if(currentRoute.name === childRoute.route_name){
								currentlyActive = true;
							}
							
						}
					}
					
				}
				
				// Determine whether parent is the currently active route
				if(topLevelRoute.route_name === currentRoute.name){
					currentlyActive = true;
				}
				
				uniqueKey++;
				
				// Generate menu heading component
				let menuItem = <MenuItem key={uniqueKey} title={topLevelRoute.menu_title} onClick={this.resetMenu} url={topLevelLink} active={currentlyActive} icon={topLevelRoute.menu_font_awesome_icon} children={children} />;
				menu.push(menuItem);
			
			}
			
		}
		
		return (
			<SidebarMenu>
				{menu}
			</SidebarMenu>
		);
	}
}

export { DynamicSidebarMenu, SidebarMenu, MenuItem, MenuLink };

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

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

 
 
 // NOTE, RECLICKING A MINIMIZED MENU MAKES IT DISAPEAR AND REAPPEAR, CONTINE FIXING THIS...
 
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
			<li><Link to={this.props.url} >{this.props.title}</Link></li>
		
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
		var childMenu = (hasChildren && this.props.active ? 
			<ul className="nav child_menu" style={{'display' : 'block'}}>{this.props.children}</ul> 
			: null);

		
		return (
        
			<li className={(this.props.active === true ? 'active' : null)}  >
				<Link to={(!hasChildren && this.props.url != null ? this.props.url : null)} onClick={this.openSubmenu.bind(this)}>
				
					{/* Add Glypicon if one is supplied */}
					{this.props.icon ? <i className={this.props.icon}></i> : null}
					
					{this.props.title}
					
					{/* Add down chevron if there are subitems */}
					{hasChildren ? <span className="fa fa-chevron-down"></span> : null}
				
				</Link>
				
				<ReactCSSTransitionGroup
					transitionName="slide"
					transitionAppear={true}
					transitionAppearTimeout={500}
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}>
		
					{/* Add submenu URLs if there are any */}
					{childMenu}
					
				</ReactCSSTransitionGroup>
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
		
		// Track the submenu that is active
		this.opened_submenu = null;

	}
	
	
	propTypes: {
		menu_full_size : React.PropTypes.bool.isRequired,
	}
	
	
	static defaultProps = {
		menu_full_size : false		
	}
	
	
	/**
	 * Ensures that only the most recently opened submenu is marked as 'active' 
	 */
	updateMenu(key){
		
		let self = this;

		// Iterate all children nodes
		let childrenElements = this.state.childrenElements.map(function (c, index) {
			
			// Determine if it's the one that was just opened
			let newlyOpened = (c.props.title === key && self.opened_submenu !== c.props.title ? true : false);
			
			let props = {
				active : newlyOpened,
			};
			
			// Set to active if its the one that was just opened
			return React.cloneElement(c, props);
		});
		
		// Update DOM
		this.setState({childrenElements : childrenElements});
		
		// Set the opened submenu to null if it was already open
		this.opened_submenu = this.opened_submenu === key ? null : key;
	}
	
	
	/**
	 * Modify all children to add a click listener
	 */
	componentDidMount(){
		
		// React.map version of ES6 map doesn't allow context to be passed in...
		let self = this;
		
		// Modify children element's to trigger updateMenu() when clicked
		let childrenElements = React.Children.map(this.props.children, function (c, index) {
			
			if(c.props.active){
				self.opened_submenu = c.props.title;
			}
			
			return React.cloneElement(c, {                    
				linkClicked: self.updateMenu.bind(self)
			});
		});
		
		this.setState({childrenElements: childrenElements});
		
	}
	
	
	/**
	 * If the menu is large and is then minimized but a submenu was previously open, close it
	 */
	componentDidUpdate(prevProps, prevState){
		
		if(prevProps.menu_full_size && !this.props.menu_full_size){
			this.opened_submenu = null;
			this.updateMenu();
		}

	}

	
	/**
	 * Minimizes any submenus if the menu is small and the user clicks out of the menu
	 *
	 */
	contextSwitchHandler(event){
		
		if(!this.props.menu_full_size){
			this.opened_submenu = null; 
			this.updateMenu(); 
		}
		
	}
	
	
	render(){
		return (
			<div id="sidebar-menu" className="main_menu_side hidden-print main_menu" tabIndex="0" onBlur={()=>{	this.contextSwitchHandler();}}>
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
	
	propTypes: {
		menu_full_size : React.PropTypes.bool.isRequired,
		config : React.PropTypes.array.isRequired,
	}
	
	static defaultProps = {
		menu_full_size : false		
	}
	
	render() {
		let currentRoute = this.props.current_route;
		let menu = [];
		let uniqueKey = 0;
		let allRoutes = this.props.config.routes;
		let menuFullSize = this.props.menu_full_size;
		
		menu.push(<MenuItem key="256" title={this.props.config.index_route.menu_title} url="/" icon={this.props.config.index_route.menu_font_awesome_icon} />);

		
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
				let menuItem = <MenuItem key={uniqueKey} title={topLevelRoute.menu_title} url={topLevelLink} active={currentlyActive} icon={topLevelRoute.menu_font_awesome_icon} children={children} />;
				menu.push(menuItem);
			
			}
			
		}
		
		return (
			<SidebarMenu menu_full_size={menuFullSize}>
				{menu}
			</SidebarMenu>
		);
	}
}

export { DynamicSidebarMenu, SidebarMenu, MenuItem, MenuLink };

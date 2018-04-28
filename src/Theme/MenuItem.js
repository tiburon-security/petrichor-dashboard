import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setOpenMenu } from '../redux/actions/SidebarMenu.js';

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

  
/**
 * Represents a top level menu heading/URL
 */
class MenuItem extends Component {
	
	constructor(props) {
		super(props);
		this.state = {submenuOpen: false};
	}
	
	
	propTypes: {
		name   	: React.PropTypes.string.isRequired,
		title	: React.PropTypes.string.isRequired,
		active	: React.PropTypes.bool.isRequired,
		icon	: React.PropTypes.string,
		url		: React.PropTypes.string
	}
	
	
	openSubmenu(e){	
		console.log("mousedown")
		this.props.openMenu(this.props.name)
	}
	
	
	render(){
		
		// Determine if there are any child elements
		let hasChildren = (this.props.children !== undefined && this.props.children.length > 0);
		var childMenu = (hasChildren && this.props.active ? 
			<ul className="nav2 child_menu" style={{'display' : 'block'}}>{this.props.children}</ul> 
			: null);

		var EntryType = (!hasChildren && this.props.url != null ? Link : "a");
		
		return (
        
			<li className={(this.props.active === true ? 'active' : null)}  >
			
			
				<EntryType to={(!hasChildren && this.props.url != null ? this.props.url : null)} onMouseDown={this.openSubmenu.bind(this)}>
				
					{/* Add Glypicon if one is supplied */}
					{this.props.icon ? <i className={this.props.icon}></i> : null}
					
					{this.props.title}
					
					{/* Add down chevron if there are subitems */}
					{hasChildren ? <span className="fa fa-chevron-down"></span> : null}
				
				</EntryType>
				
				{childMenu}
				
			</li>
		
		)
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        openMenu: (str) => dispatch(setOpenMenu(str)),
    };
};

export default connect(null ,mapDispatchToProps) (MenuItem);
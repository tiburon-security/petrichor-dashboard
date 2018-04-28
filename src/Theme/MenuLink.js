import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
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
 * Represents the link under a menu heading
 */
class MenuLink extends Component {
	
	propTypes: {
		title : React.PropTypes.string.isRequired,
		url   : React.PropTypes.string.isRequired,
	}
	
	mouseDownEvent(){
		
		this.props.pushURL(this.props.url);
		
		if(!this.props.sidebar_menu_is_fullsize){
			this.props.openMenu(null);
			
		}
		
	}
	
	render(){
		
		return (
			<li> <a onMouseDown={()=>{ this.mouseDownEvent(); }}>{this.props.title}</a></li>
		)
	}
}

const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        pushURL: (url) => dispatch(push(url)),
		openMenu: (str) => dispatch(setOpenMenu(str))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuLink);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

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
	
	render(){
		
		return (
			<li> <a onMouseDown={()=>{this.props.pushURL(this.props.url)}}> hh</a></li>
		)
	}
}


const mapDispatchToProps = (dispatch) => {
    return {
        pushURL: (url) => dispatch(push(url)),
    };
};


export default connect(null, mapDispatchToProps)(MenuLink);
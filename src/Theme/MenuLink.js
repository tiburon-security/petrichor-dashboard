import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setOpenMenu } from '../redux/actions/SidebarMenu.js';
import { withRouter } from 'react-router';
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

const Link = styled.button`
    position: relative;
    display: block;
	border: none;
	cursor: pointer;
	background: none;
	width: 100%;
	text-align: left;
	color: rgba(255,255,255,0.75)!important;
	font-size: 12px;
	padding: 9px;
	position: relative;
	display: block;
	font-weight: 500;
	
	:hover {
		color: #23527c;
	}
	
	:focus {
		outline: none;
	}
`;

/**
 * Represents the link under a menu heading
 */
class MenuLink extends Component {
	
	static propTypes = {
		title : PropTypes.string.isRequired,
		url   : PropTypes.string.isRequired,
	}
	
	mouseDownEvent(){
		
		this.props.history.push(this.props.url);
		
		if(!this.props.sidebar_menu_is_fullsize){
			this.props.openMenu(null);
			
		}
		
	}
	
	render(){
		
		return (
			<li> <Link onMouseDown={()=>{ this.mouseDownEvent(); }}>{this.props.title}</Link></li>
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
		openMenu: (str) => dispatch(setOpenMenu(str))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MenuLink))
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setOpenMenu } from '../redux/actions/SidebarMenu.js';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'

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

// Simple Wrapper that pulls out boolean CSS attributes used for conditional styling
const LinkWrapper = ({ className, active, sidebar_menu_is_fullsize, ...props }) => (
  <Link  {...props} className={className}>
    {props.children}
  </Link>
)

// Simple Wrapper that pulls out boolean CSS attributes used for conditional styling
const ButtonWrapper = ({ className, active, sidebar_menu_is_fullsize, ...props }) => (
  <button  {...props} className={className}>
    {props.children}
  </button>
)
 
const IconContainer = styled.span`
	font-size: ${props => props.sidebar_menu_is_fullsize ? "16px" : "22px"};
	text-align: ${props => !props.sidebar_menu_is_fullsize && "center"};
	width: ${props => props.sidebar_menu_is_fullsize ? "26px" : "100%"}; 
	opacity: .99;
    display: inline-block;
    font-family: FontAwesome;
    font-style: normal;
    font-weight: 400;
`;
 
const ChevronContainer = styled.span`
	display: ${props => props.sidebar_menu_is_fullsize ? "inline-block" : "none"};
	width: 26px;
	opacity: .99;
	font-family: FontAwesome;
	font-style: normal;
	font-weight: 400;
	float: right;
	text-align: center;
	padding: 0 10px 0 0;	
	font-size: 10px;
	min-width: inherit;
	color: #C4CFDA;
`;

const ChildMenu = styled.ul`
	margin-top: 5px;
	list-style: none;
	
	li {
		cursor: pointer;
	}
	
	li:hover, li:active {
		background-color: rgba(255,255,255,0.06);
	}
	
	${props => (props.sidebar_menu_is_fullsize ? `
		li:before { 
			z-index:-1;
			background:#425668;
			bottom:auto;
			content:"";
			height:8px;
			left:23px;
			margin-top:15px;
			position:absolute;
			right:auto;
			width:8px;
			z-index:1;
			border-radius:50%;
		}
		
		li:after {
			z-index:-1;
			border-left:1px solid #425668;
			bottom:0;
			content:"";
			left:27px;
			position:absolute;
			height: calc(100% - 55px);
		}
	`
	:
	`
		left: 100%;
		position: absolute;
		top: 0;
		width: 210px;
		z-index: 4000;
		background: #3E5367;
		list-style: none;
		padding-left: 0;
	`)}
`;
  
const Item = styled.li`
	position: relative;
	
	${props => props.active && (`
		border-right: 5px solid #1ABB9C;
	`)}
`;

const LinkButton = styled(ButtonWrapper)`
	position:relative;
	z-index:1;
	border: none;
	cursor: pointer;
	background: none;
	width: 100%;
	display:block;
	color: #E7E7E7;
	
	:hover {
		color: #E7E7E7;
	}

	:focus {
		outline: none;
	}

	${props => (props.sidebar_menu_is_fullsize  ?
		`	
			text-align: left;
			font-size: 13px;
			font-weight: 500;
		`
		:
		`	 
			text-align: center;
			font-size: 10px;
			font-weight: 400;
		`
	)}	
	
	${props => props.sidebar_menu_is_fullsize && props.active && (`
		padding: 13px 10px 13px 15px;
	`)};
	
	${props => props.sidebar_menu_is_fullsize && !props.active && (`
		padding: 13px 15px 13px 15px;
	`)};
	
	${props => !props.sidebar_menu_is_fullsize && props.active && (`
		padding: 10px 0 10px 5px;
	`)};
	
	${props => !props.sidebar_menu_is_fullsize && !props.active && (`
		padding: 10px 5px 10px 5px;
	`)};
	
	${props => props.active && (`
		background: linear-gradient(#334556,#2C4257), #2A3F54; 
		box-shadow: rgba(0,0,0,.25) 0 1px 0, inset rgba(255,255,255,.16) 0 1px 0;
	`)}	
`;

const StyledLink = styled(LinkWrapper)`
	position:relative;
	z-index:1;
	text-align: center;
	display:block;
	color: #E7E7E7;
	
	:hover {
		color: #E7E7E7;
	}
	

	${props => (props.sidebar_menu_is_fullsize  ?
		`
			text-align: left;
			font-size: 13px;
			font-weight: 500;
		`
		:
		`
			text-align: center;
			font-size: 10px;
			font-weight: 400;
		`
	)}
	
	${props => props.sidebar_menu_is_fullsize && props.active && (`
		padding: 13px 10px 13px 15px;
	`)};
	
	${props => props.sidebar_menu_is_fullsize && !props.active && (`
		padding: 13px 15px 13px 15px;
	`)};
	
	${props => !props.sidebar_menu_is_fullsize && props.active && (`
		padding: 10px 0 10px 5px;
	`)};
	
	${props => !props.sidebar_menu_is_fullsize && !props.active && (`
		padding: 10px 5px 10px 5px;
	`)};	
	
	${props => props.active && (`
		background: linear-gradient(#334556,#2C4257), #2A3F54; 
		box-shadow: rgba(0,0,0,.25) 0 1px 0, inset rgba(255,255,255,.16) 0 1px 0;
	`)}	
`;


/**
 * Represents a top level menu heading/URL
 */
class MenuItem extends Component {
	
	static propTypes = {
		name   	: PropTypes.string.isRequired,
		title	: PropTypes.string.isRequired,
		active	: PropTypes.bool.isRequired,
		icon	: PropTypes.array,
		url		: PropTypes.string
	}
	
	
	openSubmenu(e){	
		this.props.openMenu(this.props.name)
	}
	
	
	render(){
		
		// Determine if there are any child elements
		let hasChildren = (this.props.children !== undefined && this.props.children.length > 0);		

		var EntryType = (!hasChildren && this.props.url != null ? StyledLink : LinkButton);
		
		return (
        
			<Item active={this.props.active} >
			
			
				<EntryType 
					to={(!hasChildren && this.props.url != null ? this.props.url : null)} 
					onClick={this.openSubmenu.bind(this)}
					active={this.props.active}	
					sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}
				>
				
					{/* Add Glypicon if one is supplied */}
					{this.props.icon && (
						<IconContainer sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
							<FontAwesomeIcon icon={this.props.icon} />
						</IconContainer>
					)}
					
					{this.props.title}
					
					{/* Add down chevron if there are subitems */}
					{hasChildren && (
						<ChevronContainer sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
							<FontAwesomeIcon icon={["fas", "chevron-down"]} />
						</ChevronContainer>
					)}
				
				</EntryType>
				
				<SlideDown>
					 {this.props.active && 
						<ChildMenu active={this.props.active} sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
							{this.props.children}
						</ChildMenu>
					 }
				</SlideDown>
			</Item>
		
		)
	}
}

const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openMenu: (str) => dispatch(setOpenMenu(str)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MenuItem))
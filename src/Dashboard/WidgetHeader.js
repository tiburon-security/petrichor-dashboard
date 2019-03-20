import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Container around entire component
const Container = styled.div`
	border-bottom:2px solid #E6E9ED;
	margin-bottom:10px;
	cursor:move;
	padding:1px 5px 6px;

	h2 {
		float:left;
		display:block;
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
		width:62%;
		margin:5px 0 6px;
		font-size: ${props => props.sidebar_menu_is_fullsize ? "18px" : "17px"};
		font-weight: ${props => props.sidebar_menu_is_fullsize ? "400" : "0"};
	}

`;

// Container around close and settings button
const Toolbox = styled.div`
	display: flex;
	float:right;
`;

// Represents a styled button
const MenuButton = styled.button`
	flex: 0;
	border: none;
	cursor: pointer;
	background: none;
	font-size: 14px;
	color: #C5C7CB;
    padding: 5px;
	
	:hover {
		background: #F5F7FA;
	}
	
	:focus {
		outline: none;
	}
`;

 
class WidgetHeader extends Component {	
	
	static defaultProps = {
		settings_button: false,
		settings_button_clickhandler: null,
		close_button: false,
		close_button_clickhandler: null,
		title: "Default Header"
	}

	static propTypes = {
		settings_button: PropTypes.bool.isRequired,
		settings_button_clickhandler: PropTypes.func,
		close_button: PropTypes.bool.isRequired,
		close_button_clickhandler: PropTypes.func,
		title: PropTypes.string.isRequired
	}
  
	render() {
		return ( 
			<Container 
				sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize} 
				className="widget_draggabble_area" // Required by react-grid-layout for setting draggable area of widget
			>
			
				<h2>{this.props.title}</h2>
				
				<Toolbox>
					{this.props.settings_button && (
						<MenuButton onClick={this.props.settings_button_clickhandler}>
							<FontAwesomeIcon icon={["fas", "wrench"]}/>
						</MenuButton>
					)}
					{this.props.close_button && (
						<MenuButton onClick={this.props.close_button_clickhandler}>
							<FontAwesomeIcon icon={["fas", "times"]} />
						</MenuButton>
					)}
				</Toolbox>				
			</Container>
		);
	}
}

const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize,
    };
};

export default connect(mapStateToProps, null)(WidgetHeader);
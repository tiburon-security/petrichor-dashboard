import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Wrapper for the entire component
const Footer = styled.div`
	display: ${props => props.sidebar_menu_is_fullsize ? "block" : "none"}
	bottom:0;
	position:fixed;
	width:230px;
	background:#2A3F54;
	z-index:1;
	height:57px;
`;

// Pushes component all the way down to avoid whitespace
const Wrapper = styled.div`
	position:fixed;
	bottom:0;
	width:230px;
`;

// Container for all buttons
const OverallButtonContainer = styled.div`
	height: 37px;
	display:flex
	flex-wrap: nowrap;
	flex-direction: row;
	justify-content: center;
	align-items: stretch;
	align-content: center;
`;

// Represents a styled button
const MenuButton = styled.button`
	flex: 1;
	border: none;
	cursor: pointer;
	background: none;
	font-size: 17px;
	color: #5A738E;
	background: #172D44;
	
	:hover {
		color: #23527c;
		background: #425567;
	}
	
	:focus {
		outline: none;
	}
`;
 
class MenuFooter extends Component {	
	
	render() {

		return (

            <Footer sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
				{ this.props.config.show_menu_footer && (
					<Wrapper>
					<OverallButtonContainer>
						<MenuButton>
							<FontAwesomeIcon icon="cog" />
						</MenuButton>
						<MenuButton>
							<FontAwesomeIcon icon="arrows-alt" />
						</MenuButton>
						<MenuButton>
							<FontAwesomeIcon icon="eye-slash" />
						</MenuButton>
						<MenuButton>
							<FontAwesomeIcon icon="power-off" />
						</MenuButton>
					</OverallButtonContainer>
					</Wrapper>
				)}
            </Footer>            
		);
	}
}

const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize,
    };
};

export default connect(mapStateToProps, null)(MenuFooter);
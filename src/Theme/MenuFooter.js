import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled.div`
  bottom:0;
  clear:both;
  display:block;
  position:fixed;
  width:230px;
  background:#2A3F54;
  height:50px;
  padding:13px 0 0;
`;

// Container for all buttons
const OverallButtonContainer = styled.div`
	height: 57px;
	display:flex;
	flex-direction:row;
	flex-wrap: wrap;
	align-content:space-between;
`;

// Represents a styled button
const MenuButton = styled.button`
	flex: 1;
	height:57px;
	border: none;
	cursor: pointer;
	background: none;
	font-size: 17px;
	color: #5A738E;
	background: #172D44;
    padding: 0px 0 3px;
	
	:hover {
		color: #23527c;
		background: #425567;
	}
	
	:focus {
		outline: none;
	}
`;

// Text/icons within a button
const ButtonText = styled(FontAwesomeIcon)`
	vertical-align: 8px;
`;

 
class MenuFooter extends Component {	
	
	render() {

		return (

            <Wrapper>
				{ this.props.config.show_menu_footer && (
					<OverallButtonContainer>
						<MenuButton>
							<ButtonText icon="cog" />
						</MenuButton>
						<MenuButton>
							<ButtonText icon="arrows-alt" />
						</MenuButton>
						<MenuButton>
							<ButtonText icon="eye-slash" />
						</MenuButton>
						<MenuButton>
							<ButtonText icon="power-off" />
						</MenuButton>
					</OverallButtonContainer>
				)}
            </Wrapper>            
		);
	}
}

export default MenuFooter
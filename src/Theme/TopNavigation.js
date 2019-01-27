import React, { Component } from 'react';
import { toggleSidebarSize } from '../redux/actions/SidebarMenu.js';
import { connect } from 'react-redux';
import styled from 'styled-components';

const TopNavigationContainer = styled.div`
	margin-left 	: ${props => props.marginLeft};
	margin-bottom	: 0px;
	height			: 57px;
	background		: #EDEDED;
	border-bottom	: 1px solid #D9DEE4;
	border-radius	: 0px;
`;

const LeftContainer = styled.div`
	float	: left;
	height: 57px;
	width: 85px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ToggleButton = styled.button`
	border: none;
	cursor: pointer;
	background: none;
	font-size: 26px;
	color: #5A738E;
	
	:hover {
		color: #23527c;
	}
`;

const RightContainer = styled.div`
	float : right;
	height: 57px;
    list-style: none;
	display: flex;
	justify-content : flex-start;
	
`;

const RightContainerItem = styled.div`
	flex : 0 0 auto;
	margin: 0;
	padding: 19px 15px 0 15px;
	color: #5A738E;
	
	a:hover, a:focus{
		color: #333;
	}
	
	:hover, :focus { 
		background-color: #e7e7e7;
	}
	
	@media (max-width: 768px) {
		visibility: hidden;
	}
`;
	

class TopNavigation extends Component {
	

	
	render() {
		 
		
		
		return (
            
			<TopNavigationContainer marginLeft={(this.props.sidebar_menu_is_fullsize ? "230px" : "70px" )}>
			
				<LeftContainer>
					
					<ToggleButton onClick={()=>{this.props.toggleSidebarSize()}}>
						<i className="fa fa-bars"></i>
					</ToggleButton>
		
				</LeftContainer>

				<RightContainer>
					{this.props.children.map((child, i) =>
						<RightContainerItem key={i}>
							{child}
						</RightContainerItem>
					
					)}
				</RightContainer>

			</TopNavigationContainer>
		
		);
	}
}

const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleSidebarSize: () => dispatch(toggleSidebarSize())		
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigation);

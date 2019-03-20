import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './resources/custom.css';
import 'font-awesome/css/font-awesome.min.css';
import DynamicSidebarMenu from './DynamicSidebarMenu';
import MenuFooter from './MenuFooter';
import TopNavigation from './TopNavigation';
import Footer from './Footer';
import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';
import PopupModal from './PopupModal';
import { toggleSidebarSize, setSidebarFullsize } from '../redux/actions/SidebarMenu.js';
import { Route, Switch } from 'react-router';
import  { recursivelyWalkRoutes } from '../Helpers/Routes';
import { connect } from 'react-redux';
import get from 'lodash/get';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Brings all components used in dynamic routes into namespace
// for referencing by their string name
import * as routableViews from '../RoutableViews.js';

const BrandingContainer = styled.div`
	height: 57px;
	font-weight: 400;
	font-size: 19px;
	color: #ECF0F1;
	display:flex;
	flex-wrap: nowrap;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	align-content: center;
	margin-bottom: 20px;
	
	${props => props.sidebar_menu_is_fullsize ? `
		width: 230px;
	`
	:
	`
		width: 70px;
	`
	};
}
`;

const Logo = styled.div`
	flex: 0 0 auto;
	svg {
		border: 1px solid #EAEAEA;
		border-radius: 50%;
		padding: 5px 6px;
	}
	
	${props => props.sidebar_menu_is_fullsize ? `
		font-size:32px;
		margin: 0 5px 0 0;
	`
	:
	`
		font-size:40px;
		margin: 13px 0 0 0;
	`};

`;

const WebsiteTitle = styled.div`
	flex: 0 0 auto;
	
	.nav-md > & {
		color: red !important;
	}
	
	${props => !props.sidebar_menu_is_fullsize && `display:none`};
`;

const MainContainer = styled.div`
	display: flex;
	min-height: 100vh;
	flex-direction: column;
	overflow: hidden;
`;

const LeftContainer = styled.div`
	min-height: 100%;
	position: absolute;
	padding: 0;
	display: block;

	${props => props.sidebar_menu_is_fullsize ? `
		width: 230px;
		z-index: 1;
	`
	:
	`
		width: 70px;
		z-index: 9999;
	`};
`;

const RightContainer = styled.div`
    padding: 10px 20px 0;
	background: #F7F7F7;
	flex: 1 1;
	
	${props => props.sidebar_menu_is_fullsize ? `
		margin-left: 230px;
	`
	:
	`
		margin-left: 70px;
		z-index: 2;
	`};
`;

export class Gentella extends Component {
	
	constructor(props) {
		super(props);
		this.state = {menuFullsize : true};
	}


	componentDidMount(){
		document.title = this.props.config.website_name;
		
		// Listen to window being resized
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions.bind(this));
	}
	
	
	/**
	* Calculate & Update state of new dimensions
	*/
	updateDimensions() {
		if(window.innerWidth > 990){
			this.props.setSidebarFullsize(true);
		} else {
			this.props.setSidebarFullsize(false);
		}
	}
	
	
	/**
	* Remove event listener
	*/
	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions.bind(this));
	}

	
  render() {

    return (
		<MainContainer className={(this.props.sidebar_menu_is_fullsize ? 'nav-md' : 'nav-sm')}>
			<LeftContainer sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
				<BrandingContainer sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
					<Logo sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
						<FontAwesomeIcon icon={["fas", "paw"]} />
					</Logo>
					<WebsiteTitle sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
						{this.props.config.website_name}
					</WebsiteTitle>
				</BrandingContainer>

				<Switch>
					{recursivelyWalkRoutes(this.props.config.routes, (index, obj, fullPath, level) => {
						return (
							<Route 
								exact
								path={fullPath}
								key={index}
								render={(props)=>(
									<DynamicSidebarMenu 
										route_name={obj.route_name} 
										config={this.props.config}/>
								)}
							/>
						)
					})}
				</Switch>
				
				<MenuFooter config={this.props.config} />
			</LeftContainer>

			<TopNavigation>
				{this.props.config.notifications_api_endpoint !== null &&
					<Notifications notifications_api={this.props.config.notifications_api_endpoint} />
				}
				<ProfileDropdown user_name={get(this.props.userConfig, this.props.config.user_api_name_key)} />
			</TopNavigation>

			<PopupModal />
			
			<RightContainer sidebar_menu_is_fullsize={this.props.sidebar_menu_is_fullsize}>
				{/* page content */}
					<Switch>
						{recursivelyWalkRoutes(this.props.config.routes, (index, obj, fullPath, level) => {
							
							let ChildComponentRender = routableViews[obj.component];
							
							return (
								<Route 
									exact
									path={fullPath}
									key={index}
									render={(props)=>(
										<ChildComponentRender route_name={obj.route_name} />
									)}
								/>
							)
						})}
					</Switch>
			</RightContainer>
			
			<Footer>
				{ this.props.config.footer_text }
			</Footer>
		</MainContainer>
	);
  }
}


const mapStateToProps = (state) => {
    return {
        sidebar_menu_is_fullsize: state.sidebar.isFullSize,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSidebarFullsize: (bool) => dispatch(setSidebarFullsize(bool)),
        toggleSidebarSize: () => dispatch(toggleSidebarSize())		
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Gentella);
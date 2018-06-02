import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './resources/custom.css';
import 'font-awesome/css/font-awesome.min.css';
import profile_pic from './resources/images/img.jpg';
import DynamicSidebarMenu from './DynamicSidebarMenu';
import MenuFooter from './MenuFooter';
import TopNavigation from './TopNavigation';
import Footer from './Footer';
import ProfileQuickInfo from './ProfileQuickInfo';
import Notifications from './Notifications';
import ProfileDropdown from './ProfileDropdown';
import PopupModal from './PopupModal';
import { toggleSidebarSize, setSidebarFullsize } from '../redux/actions/SidebarMenu.js';
import { Route, Switch } from 'react-router';
import  { recursivelyWalkRoutes } from '../Helpers/Routes';
import { connect } from 'react-redux';

// Brings all components used in dynamic routes into namespace
// for referencing by their string name
import * as routableViews from '../RoutableViews.js';

export class Gentella extends Component {
	
	constructor(props) {
		super(props);
		this.state = {menuFullsize : true};

	}


	componentDidMount(){
		console.log("gentella mounting")
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
		
		<div className={(this.props.sidebar_menu_is_fullsize ? 'nav-md' : 'nav-sm')}>
			<div className="full_container body">
				<div className="main_container">
					<div className="col-md-3 left_col">
						<div className="left_col scroll-view">
						
							<div className="nav_title" style={{"border": "0"}}>
								<span className="site_title"><i className="fa fa-paw"></i> {this.props.config.website_name}</span>
							</div>

							<div className="clearfix"></div>

							<ProfileQuickInfo user_name="Jovanni Hernandez" image_path={profile_pic}/>

							<br />
							
							<Switch>
								{recursivelyWalkRoutes(this.props.config.routes, (index, obj, fullPath, level) => {
									return (
										<Route 
											exact
											path={fullPath}
											key={index}
											render={(props)=>(
												<DynamicSidebarMenu 
													location={this.props.location} 
													route_name={obj.route_name} 
													config={this.props.config}/>
											)}
										/>
									)
								})}
							</Switch>
							
							<MenuFooter/>

						</div>
					</div>


					<TopNavigation>
						<Notifications notifications_api="/sample_notifications_api.json" notifications={this.props.config.notifications}/>
						<ProfileDropdown user_name="Jovanni Hernandez" />
					</TopNavigation>


					<PopupModal />
					
					<div className="right_col" role="main" id="gentella_content_body">

						{/* page content */}
						<div>
							<Switch>
								{recursivelyWalkRoutes(this.props.config.routes, (index, obj, fullPath, level) => {
									
									let ChildComponentRender = routableViews[obj.component];
									
									return (
										<Route 
											exact
											path={fullPath}
											key={index}
											render={(props)=>(
												<ChildComponentRender route_name={obj.route_name} {...props} />
											)}
										/>
									)
								})}
							</Switch>
						</div>

					</div>
					
					<Footer>
						Petrichor Dashboard - by <a href="https://github.com/jovanni-hernandez/petrichor-dashboard">Jovanni Hernandez</a>
					</Footer>

				</div>
			</div>
		</div>
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
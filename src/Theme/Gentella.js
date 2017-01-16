import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './resources/custom.css';
import 'font-awesome/css/font-awesome.min.css';
import profile_pic from './resources/images/img.jpg';

import {DynamicSidebarMenu} from './SidebarMenu';
import MenuFooter from './MenuFooter';
import TopNavigation from './TopNavigation';
import Footer from './Footer';
import ProfileQuickInfo from './ProfileQuickInfo';
import Notifications from './Notifications'
import ProfileDropdown from './ProfileDropdown'

export class Gentella extends Component {
	
	constructor(props) {
		super(props);
		this.state = {menuFullsize : true};
		
		// Get application configuration from the router
		this.config = this.props.route.config;
		
		this.currentRoute = this.props.routes[this.props.routes.length - 1];
	}
  
  
	/**
	 * Toggle the size of the sidebar menu when toggle button clicked. This a very
	 * non-react solution, but the body tag can't be modified via typicaly react 
	 * functions. This tag is a carryover from the Gentella theme.
	 */
  	topNavigationClickHandler(event){
		
		if(this.state.menuFullsize){
			document.body.classList.remove("nav-md");
			document.body.classList.add("nav-sm");
			
		}else {
			document.body.classList.remove("nav-sm");
			document.body.classList.add("nav-md");
		}
		
		// Toggle size state
		this.setState({menuFullsize : !this.state.menuFullsize});
	}
	
	componentDidMount(){
		// Full size menu by default
		document.body.classList.add("nav-md");
	}
	
  render() {
	 
    return (
		<div className="container body">
			<div className="main_container">
				<div className="col-md-3 left_col">
					<div className="left_col scroll-view">
					
						<div className="navbar nav_title" style={{"border": "0"}}>
							<span className="site_title"><i className="fa fa-paw"></i> {this.config.website_name}</span>
						</div>

						<div className="clearfix"></div>

						<ProfileQuickInfo user_name="Jovanni Hernandez" image_path={profile_pic}/>

						<br />

						<DynamicSidebarMenu menu_full_size={this.state.menuFullsize} current_route={this.currentRoute}/>

						<MenuFooter/>

					</div>
				</div>


				<TopNavigation onClick={this.topNavigationClickHandler.bind(this)}>
					<ProfileDropdown user_name="Jovanni Hernandez" show_dropdown={true}/>
					<Notifications notifications={this.config.notifications}/>
				</TopNavigation>


				
				<div className="right_col" role="main" id="gentella_content_body">

					{/* page content */}
					<div style={{"marginTop" : "50px"}}>
						{this.props.children}
					</div>

				</div>
				
				<Footer>
					Petrichor Dashboard - by <a href="https://github.com/jovanni-hernandez/petrichor-dashboard">Jovanni Hernandez</a>
				</Footer>

			</div>
		</div>
	);
  }
}

 export default Gentella;
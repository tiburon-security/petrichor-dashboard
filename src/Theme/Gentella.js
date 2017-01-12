import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './resources/custom.css';
import 'font-awesome/css/font-awesome.min.css';


import {DynamicSidebarMenu} from './SidebarMenu';
import MenuFooter from './MenuFooter';
import TopNavigation from './TopNavigation';
import Footer from './Footer';
import ProfileQuickInfo from './ProfileQuickInfo';

export class Gentella extends Component {
	
	constructor(props) {
		super(props);
		this.state = {menuFullsize : true};

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
				console.log("route:");
		console.log(  this.props);
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
							<a href="index.html" className="site_title"><i className="fa fa-paw"></i> <span>Gentellela Alela!</span></a>
						</div>

						<div className="clearfix"></div>

						<ProfileQuickInfo/>

						<br />

						<DynamicSidebarMenu/>

						<MenuFooter/>

					</div>
				</div>


				<TopNavigation onClick={this.topNavigationClickHandler.bind(this)}/>


				
				<div className="right_col" role="main" id="gentella_content_body">

					{/* page content */}
					<div style={{"margin-top" : "50px"}}>
						{this.props.children}


					</div>

				</div>
				
				<Footer>
					Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com">Colorlib</a>
				</Footer>

			</div>
		</div>
	);
  }
}

 export default Gentella;
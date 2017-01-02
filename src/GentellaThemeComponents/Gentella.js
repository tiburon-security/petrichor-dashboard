import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './resources/custom.css';
import 'font-awesome/css/font-awesome.min.css';


import {DynamicSidebarMenu, SidebarMenu, MenuItem, MenuLink} from './SidebarMenu';
import MenuFooter from './MenuFooter';
import TopNavigation from './TopNavigation';
import Footer from './Footer';
import ProfileQuickInfo from './ProfileQuickInfo';

export class Gentella extends Component {
	  constructor(props) {
    super(props);
  }
componentDidMount(){
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

	<TopNavigation/>

        {/* page content */}
        <div className="right_col" role="main" id="gentella_content_body">

		<Footer/>

	</div>

      </div>
    </div>
	);
  }
}

 export default Gentella;
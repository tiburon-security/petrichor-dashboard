import React, { Component } from 'react';
import Notifications from './Notifications'

class TopNavigation extends Component {
	
	render() {
		return (
            
        
        <div className="top_nav">
          <div className="nav_menu">
            <nav>
              <div className="nav toggle">
                <a id="menu_toggle" onClick={this.props.onClick}><i className="fa fa-bars"></i></a>
              </div>

              <ul className="nav navbar-nav navbar-right">
                <li className="">
                  <a href="#" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <img src="images/img.jpg" alt="John"/>John Doe
                    <span className=" fa fa-angle-down"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-usermenu pull-right">
                    <li><a href="#"> Profile</a></li>
                    <li>
                      <a href="#">
                        <span className="badge bg-red pull-right">50%</span>
                        <span>Settings</span>
                      </a>
                    </li>
                    <li><a href="#">Help</a></li>
                    <li><a href="login.html"><i className="fa fa-sign-out pull-right"></i> Log Out</a></li>
                  </ul>
                </li>

				<Notifications/>

              </ul>
            </nav>
          </div>
        </div>
        
            
		);
	}
}

export default TopNavigation;

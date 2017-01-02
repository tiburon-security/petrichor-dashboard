import React, { Component } from 'react';
import profile_pic from './resources/images/img.jpg';

class ProfileQuickInfo extends Component {	
	
	render() {
		return (
            

            <div className="profile">
              <div className="profile_pic">
                <img src={profile_pic} alt="..." className="img-circle profile_img"/>
              </div>
              <div className="profile_info">
                <span>Welcome,</span>
                <h2>John Doe</h2>
              </div>
            </div>

        
           
            
		);
	}
}

export default ProfileQuickInfo

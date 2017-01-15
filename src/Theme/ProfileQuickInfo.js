import React, { Component } from 'react';

class ProfileQuickInfo extends Component {	

	propTypes: {
		image_path    : React.PropTypes.string,
		user_name : React.PropTypes.string,
		
	}
	
	static defaultProps = {
		user_name: "Unknown",
		show_dropdown : false		
	}
	
	render() {
		
		// If not picture provided, use a default icon
		var undefinedUserPicture = (
			<span className="fa-stack fa-2x img-circle no_profile_img">
				<i className="fa fa-circle fa-stack-2x"></i>
				<i className="fa fa-user fa-stack-1x fa-inverse"></i>
			</span>
		);
		
		return (
            

            <div className="profile">
              <div className="profile_pic">
				
				{(this.props.image_path ? <img src={this.props.image_path} alt="Profile" className="img-circle profile_img"/> : undefinedUserPicture)}

              </div>
              <div className="profile_info">
                <span>Welcome,</span>
                <h2>{this.props.user_name}</h2>
              </div>
            </div>

        
           
            
		);
	}
}

export default ProfileQuickInfo

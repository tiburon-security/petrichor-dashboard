import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { openPopupModal } from '../redux/actions/PopupModal.js';

/**
 * Component that shows notifications in the toolbar
 */
class Notifications extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			menu_open: false,
			expanded_notification : null
		};
	}
	
	static defaultProps = {
		notifications: []
	}
  
	static propTypes = {
		notifications: PropTypes.array.isRequired
	}
	
	millisecondsToHours(millis){
        return Math.floor((millis / (1000 * 60 * 60)).toFixed(1));
	}	
	
	millisecondsToDays(millis){
        return Math.floor((millis / (1000 * 60 * 60 * 24)).toFixed(1));
	}
	
	
	expandNotification(index){
		console.log(index)
		var selectedNotification = this.props.notifications[index]
		
		var title = "Notification - " + selectedNotification.iso_datetime
		var body = selectedNotification.message;
	
		this.props.openPopupModal(title, body);
	
	}
	
	render() {  

		// Random number to serve as key for dropdown
		var eventKey = 5369;

		var notificationItems = [];
		var numWithinLastDay = 0;
		
		const FULL_DAY = 60 * 60 * 1000 * 24; // One day in milis
		
		for (let [index, notification] of this.props.notifications.entries()) {
			
			var timestamp = new Date(notification.iso_datetime)

			// Pretty string for how many hours or days ago notification was created
			var timeAge = null;
			if(((new Date()) - timestamp) < FULL_DAY){
				timeAge = this.millisecondsToHours((new Date()) - timestamp) + " hour(s) ago";
				numWithinLastDay++;
			} else {
				timeAge = this.millisecondsToDays((new Date()) - timestamp) + " day(s) ago"
			}
			
			var shortenedMessage = notification.message.slice(0, 100) + "..."
			
			var elems = (
				<MenuItem eventKey={parseFloat(eventKey + "." + index)} key={index} onSelect={() => this.expandNotification(index)} className="notification_item">
					<span className="image"><span className={notification.font_awesome_icon}></span></span>
					<span>
						<span className="time">{timeAge}</span>
					</span>
					<span className="message">
						{shortenedMessage}
					</span>
				</MenuItem>
			)
			
			notificationItems.push(elems);
		}
		
		var hoverNotificationCountMessage = numWithinLastDay + " new notifications in the last day."
		
		var icon = (
			<span className="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false" title={hoverNotificationCountMessage}>
				<i className="fa fa-envelope-o"></i>
				{(numWithinLastDay > 0 ? <span className="badge bg-green">{numWithinLastDay}</span> : null)}
			</span>
		)
		
		return (
			<NavDropdown id="notification_dropdown" eventKey={eventKey} title={icon} noCaret={true} className="notification_dropdown">
					{notificationItems}
			</NavDropdown>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        openPopupModal: (title, body) => dispatch(openPopupModal(title,body)),
    };
};

export default connect(null, mapDispatchToProps)(Notifications);

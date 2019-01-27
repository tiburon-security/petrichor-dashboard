import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { openPopupModal } from '../redux/actions/PopupModal.js';
import styled from 'styled-components';

// Button for opening dropdown menu
const DropdownToggle = styled.button`
	border: none;
	cursor: pointer;
	background: none;
`;

// Adds styles to react-bootstrap Dropdown
const CustomDropdown = styled(Dropdown)`	
	ul {
		width:300px;
	}
	
	ul li a {
		color:#5A738E;
		padding: 0;
		  white-space:normal;

	}
`;

// Adds styles to react-bootstrap Dropdown
const CustomMenuItem = styled(MenuItem)`	
	background:#f7f7f7;
	display:flex;
	width:96%!important;
	margin:6px 6px 0;
	padding:5px;
`;

// The time for each notification
const NotificationItemTime = styled.span`
	font-size:11px;
	font-style:italic;
	font-weight:700;
	position:absolute;
	right:35px;
`;

// Represents a notification item
const NotificationItem = styled.span`
  display:block!important;
  font-size:11px;
  
  :hover {
	  color: #000;
  }
`;

// Style for notifications count
const NotificationCount = styled.span`
	font-size: 8px;
	font-weight: 400;
	line-height: 13px;
	position: absolute;
	right: -10px;
	top: -10px;
`;

/**
 * Component that shows notifications in the toolbar
 */
class Notifications extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			menu_open: false,
			expanded_notification : null,
			notifications: []
		};
	}
	
	static defaultProps = {
		notifications: []
	}
  
	static propTypes = {
		notifications_api: PropTypes.string.isRequired,
		notifications: PropTypes.array.isRequired
	}
	
	millisecondsToHours(millis){
        return Math.floor((millis / (1000 * 60 * 60)).toFixed(1));
	}	
	
	millisecondsToDays(millis){
        return Math.floor((millis / (1000 * 60 * 60 * 24)).toFixed(1));
	}
	
	
	expandNotification(index){
		var selectedNotification = this.state.notifications[index]
		
		var title = "Notification - " + selectedNotification.iso_datetime
		var body = selectedNotification.message;
	
		this.props.openPopupModal(title, body);
	}
	
	
	/**
	 * Fetch notifications from API
	 */
	componentDidMount() {
		
		if(this.props.notifications_api !== null){
			fetch(this.props.notifications_api)
				.then(response => response.json())
				.then(data => { 
					this.setState({ notifications: data.data })
				});
		}
	}
	
	render() {  

		// Random number to serve as key for dropdown
		var eventKey = 5369;

		var notificationItems = [];
		var numWithinLastDay = 0;
		
		const FULL_DAY = 60 * 60 * 1000 * 24; // One day in milis
		
		for (let [index, notification] of this.state.notifications.entries()) {
			
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
				<CustomMenuItem 
					eventKey={parseFloat(eventKey + "." + index)} 
					key={index} 
					onSelect={() => this.expandNotification(index)}
					className="notification_item"
				>
					<span className={notification.font_awesome_icon}></span>
					
					<NotificationItemTime>
						{timeAge}
					</NotificationItemTime>
					
					<NotificationItem>
						{shortenedMessage}
					</NotificationItem>
				</CustomMenuItem>
			)
			
			notificationItems.push(elems);
		}
		
		var hoverNotificationCountMessage = numWithinLastDay + " new notifications in the last day."
		
		var title = (
			<span title={hoverNotificationCountMessage}>
				<i className="fa fa-envelope-o"></i>
				{(
					numWithinLastDay > 0 && 
						<NotificationCount className="badge bg-green">
							{numWithinLastDay}
						</NotificationCount> 
				)}
			</span>
		)
		
		return (
			<CustomDropdown id="notification_dropdown">
				<DropdownToggle bsRole="toggle">{title}</DropdownToggle>
				<Dropdown.Menu
					className="dropdown-menu-right" // BS 3 style to prevent menu being offscreen 
				>
					{notificationItems}
				</Dropdown.Menu>
			</CustomDropdown>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        openPopupModal: (title, body) => dispatch(openPopupModal(title,body)),
    };
};

export default connect(null, mapDispatchToProps)(Notifications);
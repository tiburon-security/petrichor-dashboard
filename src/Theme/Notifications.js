import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { openPopupModal } from '../redux/actions/PopupModal.js';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Button for opening dropdown menu
const DropdownToggle = styled.button`
	height:57px;
	padding: 0 15px;
	border: none;
	cursor: pointer;
	background: none;
	color:#515356;
	
	:focus {
		outline: none;
	}
	
	:after {
		display:none;
	}
`;

// Adds styles to react-bootstrap Dropdown menu
const CustomDropDownMenu = styled.div`
	left:auto  !important;
	right 0 !important;
	top:54px !important;
	transform:none !important;
	border: 1px solid #D9DEE4;
	border-radius:0;
`;

// Adds styles to react-bootstrap Dropdown item
const CustomMenuItem = styled(Dropdown.Item)`	
	font-weight: normal;
	background:#f7f7f7;
	display:block;
	width:300px;
	margin:6px 6px 0;
	padding:5px;
	color: #5A738E;
	
	:active {
		background:#f7f7f7;
		color: #5A738E;
	}
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
	width:300px;
	display:block!important;
	font-size:11px;
	white-space:normal;
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
	margin: -10px 10px 0 0;
	background: #1ABB9C!important;
	border: 1px solid #1ABB9C!important;
	color: #fff;
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
				>
					<span>
					<FontAwesomeIcon icon={notification.font_awesome_icon} /></span>
					
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
				<FontAwesomeIcon icon={["far", "envelope"]} />
				{(
					numWithinLastDay > 0 && 
						<NotificationCount className="badge">
							{numWithinLastDay}
						</NotificationCount> 
				)}
			</span>
		)
		
		return (
			<Dropdown style={{"position":"relative"}}>
				<Dropdown.Toggle as={DropdownToggle}>{title}</Dropdown.Toggle>
				<Dropdown.Menu as={CustomDropDownMenu} alignRight={true}>
					{notificationItems}
				</Dropdown.Menu>
			</Dropdown>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        openPopupModal: (title, body) => dispatch(openPopupModal(title,body)),
    };
};

export default connect(null, mapDispatchToProps)(Notifications);
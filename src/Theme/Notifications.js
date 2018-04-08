import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, NavDropdown, MenuItem } from 'react-bootstrap';

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
	
	
	/**
	 * Open/close the notification dropdown menu
	 */
	toggleMenuOpen(){
		this.setState({menu_open:!this.state.menu_open});
	}
	
	
	/*
	 * Displays a modal with the full message of a selected notification
	 */
	expandNotification(index){
		console.log(index)
		var selectedNotification = this.props.notifications[index]
		
		var elem = (
			<div className="static-modal">
				<Modal.Dialog>
					<Modal.Header>
						<Modal.Title>Notification - {selectedNotification.iso_datetime}</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						{selectedNotification.message}
					</Modal.Body>

					<Modal.Footer>
						<Button onClick={() => this.setState({expanded_notification : null})}>Close</Button>
					</Modal.Footer>

				</Modal.Dialog>
			</div>
		)
		
		this.setState({menu_open : false, expanded_notification : elem});
	}
	
	render() {  

		// Random number to serve as key for dropdown
		var eventKey = 5369;

		var notificationItems = [];
		var numWithinLastDay = 0;
		
		for (let [index, notification] of this.props.notifications.entries()) {
			
			const FULL_DAY = 60 * 60 * 1000 * 24; // One day in milis
			
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
				<MenuItem eventKey={parseFloat(eventKey + "." + index)} onSelect={() => this.expandNotification(index)}>
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
		
		var test = 	(<a href="#" className="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false" onClick={this.toggleMenuOpen.bind(this)}>
					<i className="fa fa-envelope-o"></i>
					{(numWithinLastDay > 0 ? <span className="badge bg-green">{numWithinLastDay}</span> : null)}
				</a>)
		
		return (


				
				

				<div>
				<NavDropdown eventKey={3} title={test} id="basic-nav-dropdown">
					<MenuItem eventKey={3.1}>Action</MenuItem>
						{notificationItems}
						{/*<ul id="menu1" className="dropdown-menu list-unstyled msg_list" role="menu">
					{}
				</ul>*/}
				
				</NavDropdown>
				{this.state.expanded_notification}
				</div>
			

			
		);
	}
}

export default Notifications;
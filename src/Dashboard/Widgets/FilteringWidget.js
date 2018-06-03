import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import qs from 'query-string';
import moment from 'moment';
import { Button, FormControl } from 'react-bootstrap';
import { sendInterwidgetMessage, sendMultipleInterwidgetMessages, INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';


// Date Picket Imports
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates'; 


/*

TODO - make date changes update the page's url
	- integrate fake json data, update url w/ page numbers & chunk sizes..

*/

class FakeWidget extends Component {
		
	constructor(state){
		super(state);
		
		// Get date & search parameters from URL
		let queryParams = qs.parse(this.props.location.search)
		
		let startDate = (queryParams.start_date === undefined) ? null : moment(queryParams.startDate)
		let endDate = (queryParams.end_date === undefined) ? null : moment(queryParams.endDate)
		
		// If there's date in the URL - notify other widgets
		if(startDate !== null && endDate !== null){
			this.props.sendMultipleInterwidgetMessages([
				{
					messageType:INTERWIDGET_MESSAGE_TYPES.START_DATE,
					message:startDate.format('YYYY-MM-DD')
				},			
				{
					messageType:INTERWIDGET_MESSAGE_TYPES.END_DATE,
					message:endDate.format('YYYY-MM-DD')
				}
			])			
		}

		this.state = ({loading:false, searchValue:"", startDate, endDate})
		
	}
	
	handleSearchChange(event) {
		this.setState({searchValue: event.target.value});
	}
	
	
	filter(){

		if(this.state.startDate !== null && this.state.endDate !== null){
			
			let startDate = this.state.startDate.format('YYYY-MM-DD');
			let endDate = this.state.endDate.format('YYYY-MM-DD');
			
			console.log("filtering")
			//this.props.sendInterwidgetMessage(INTERWIDGET_MESSAGE_TYPES.START_DATE, startDate)
			this.props.sendMultipleInterwidgetMessages([
				{
					messageType:INTERWIDGET_MESSAGE_TYPES.START_DATE,
					message:startDate
				},			
				{
					messageType:INTERWIDGET_MESSAGE_TYPES.END_DATE,
					message:endDate
				}
			])
		
		    const query = { 
				start_date : startDate, 
				end_date : endDate,
				search : this.state.searchValue
			};

			const searchString = qs.stringify(query);

			this.props.pushURL({
				search: searchString
			})
			
		}
	}	
	
	
	render() {
    
		return (  
			<div style={{"maxWidth":"510px", "display":"inline-flex", "float" : "right"}}>
			
				<div style={{display:"inline-block", margin : "0 5px"}}>

					<DateRangePicker
						small={true}
						appendToBody 
						startDate={this.state.startDate} // momentPropTypes.momentObj or null,
						startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
						endDate={this.state.endDate} // momentPropTypes.momentObj or null,
						endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
						onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
						focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
						onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
						anchorDirection="right"
					/>

				</div>
				
				<div style={{display:"inline-block", margin : "0 5px"}}>
					<FormControl
						type="text"
						value={this.state.searchValue}
						placeholder="Enter text"
						onChange={this.handleSearchChange.bind(this)}
						style={{"height" : "36px", "borderRadius" : "0"}}
					/>
				</div>
				
				<div style={{display:"inline-block", margin : "0 5px"}} md={1}>
					<Button 
						onClick={this.filter.bind(this)}
						style={{"height" : "36px", "borderRadius" : "0"}}
					>
						Filter
					</Button>
				</div>

				
			</div>
		);
  
	}

}

const mapStateToProps = (state) => {
    return {
        widgets: state.dashboard.widgets
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        pushURL: (url) => dispatch(push(url)),
        sendInterwidgetMessage: (messageType, message) => dispatch(sendInterwidgetMessage(messageType, message)),
        sendMultipleInterwidgetMessages: (messages) => dispatch(sendMultipleInterwidgetMessages(messages)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(FakeWidget);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import qs from 'qs';
import moment from 'moment';
import { Button, FormControl } from 'react-bootstrap';
import { sendInterwidgetMessage, sendMultipleInterwidgetMessages, INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';

// Date Picket Imports
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates'; 


class FilteringWidget extends Component {
		
	constructor(state){
		super(state);
		
		this.getDefaultFilters();

	}
	
	
	propTypes: {
		showKeywordFilter 		: React.PropTypes.bool,
		showDateFilter 			: React.PropTypes.bool,
		queryStringKeyword		: React.PropTypes.string,
		queryStringStartDate	: React.PropTypes.string,
		queryStringEndDate		: React.PropTypes.string,

	}
	
	
	static defaultProps = {
		showKeywordFilter 		: true,
		showDateFilter 			: true,
		queryStringKeyword		: "search",
		queryStringStartDate	: "start_date",
		queryStringEndDate		: "end_date"
	}
	
	
	handleSearchChange(event) {
		this.setState({searchValue: event.target.value});
	}
	
	
	getDefaultFilters(){
		
		// Get date & search parameters from URL
		let queryParams = qs.parse(this.props.location.search)
		
		let keyword 	= (queryParams[this.props.queryStringKeyword] === undefined) 	? "" : queryParams[this.props.queryStringKeyword]
		let startDate 	= (queryParams[this.props.queryStringStartDate] === undefined) 	? null : moment(queryParams[this.props.queryStringStartDate])
		let endDate 	= (queryParams[this.props.queryStringEndDate] === undefined) 	? null : moment(queryParams[this.props.queryStringEndDate])
		
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
		
		// If there's a search value, notify other widgets
		if(keyword !== ""){
			this.props.sendInterwidgetMessage(INTERWIDGET_MESSAGE_TYPES.KEYWORD_SEARCH, keyword)
		}
		
		this.state = ({
			loading:false, 
			searchValue:keyword, 
			startDate, 
			endDate
		})
	}
	
	
	filter(){
		
		let query = qs.parse(this.props.location.search);

		// Proccess start/end date
		if(this.state.startDate !== null && this.state.endDate !== null){
			
			let startDate = this.state.startDate.format('YYYY-MM-DD');
			let endDate = this.state.endDate.format('YYYY-MM-DD');
			
			// Send message to other widgets
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
			
			query[this.props.queryStringStartDate] = startDate;
			query[this.props.queryStringEndDate] = endDate;
			
		}

		// Process keyword search
		if(this.state.searchValue !== ""){
			// Send message to other widgets
			this.props.sendInterwidgetMessage(INTERWIDGET_MESSAGE_TYPES.KEYWORD_SEARCH, this.state.searchValue)
			query[this.props.queryStringKeyword] = this.state.searchValue;

			}
		
		// Add query data to URL if there are any filters applied
		if(Object.keys(query).length > 0){
			const searchString = qs.stringify(query);

			this.props.pushURL({
				search: searchString
			})
		}	
	}	
	
	
	render() {
    
		return (  
			<div style={{"maxWidth":"510px", "display":"inline-flex", "float" : "right"}}>
			
				{/* Date Filter */}
				{
					(
						this.props.showDateFilter ? 
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
						:
							""
					)
				}
				
				{/* Keyword Filter */}				
				{
					(
						this.props.showKeywordFilter ?
							<div style={{display:"inline-block", margin : "0 5px"}}>
								<FormControl
									type="text"
									value={this.state.searchValue}
									placeholder="Enter text"
									onChange={this.handleSearchChange.bind(this)}
									style={{"height" : "36px", "borderRadius" : "0"}}
								/>
							</div>
						:
							""
					)
				}
				
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

export default connect(mapStateToProps, mapDispatchToProps)(FilteringWidget);
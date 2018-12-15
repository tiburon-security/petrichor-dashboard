import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'qs';
import moment from 'moment';
import { Button, FormControl } from 'react-bootstrap';
import { sendInterwidgetMessage, sendMultipleInterwidgetMessages, removeMultipleInterwidgetMessages, INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';
import { stripQueryStringSeperator } from '../../Helpers/Generic.js'

// Date Picket Imports
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates'; 


class FilteringWidget extends Component {
		
	constructor(state){
		super(state);
		
		let { searchValue, startDate, endDate } = this.getDefaultFilters();
		
		this.state = {
			startDate, 
			endDate,
			searchValue
		}
	}
	
	static propTypes = {
		show_keyword_filter 	: PropTypes.bool,
		show_date_filter 		: PropTypes.bool,
		query_string_keyword	: PropTypes.string,
		query_string_start_date	: PropTypes.string,
		query_string_end_date	: PropTypes.string
	}
	
	
	static defaultProps = {
		show_keyword_filter 	: true,
		show_date_filter 		: true,
		query_string_keyword	: "search",
		query_string_start_date	: "start_date",
		query_string_end_date	: "end_date"
	}
	
	
	handleSearchChange(event) {
		this.setState({searchValue: event.target.value});
	}
	
	
	/**
	 * Resets filters when filters when the widget is unmounted
	 */
	componentWillUnmount(){
		
		this.clearFilters()	
	}
	
	getDefaultFilters(){
		
		// Get date & search parameters from URL
		let queryParams = qs.parse(stripQueryStringSeperator(this.props.location.search))
		
		let keyword 	= (queryParams[this.props.query_string_keyword] === undefined) 	? "" : queryParams[this.props.query_string_keyword]
		let startDate 	= (queryParams[this.props.query_string_start_date] === undefined) 	? null : moment(queryParams[this.props.query_string_start_date])
		let endDate 	= (queryParams[this.props.query_string_end_date] === undefined) 	? null : moment(queryParams[this.props.query_string_end_date])
		
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
		
		return {
			searchValue:keyword, 
			startDate, 
			endDate
		}
	}

	
	/**
	 * Clears filters by notifying widgets, updating the UI, and clearing the query string
	 */
	clearFilters(){
		
		// Notify other dashboard widgets that filters have been removed
		this.props.removeMultipleInterwidgetMessages([
			INTERWIDGET_MESSAGE_TYPES.START_DATE,
			INTERWIDGET_MESSAGE_TYPES.END_DATE,
			INTERWIDGET_MESSAGE_TYPES.KEYWORD_SEARCH

		])
		
		// Clear the filtering UI components
		this.setState({
			startDate 	: null, 
			endDate 	: null,
			searchValue : ""
		});
		
		// Clean up the query string to remove filters
		const existingQueryParams = qs.parse(stripQueryStringSeperator(this.props.location.search))
		
		let queryParamsToRemove = [
			this.props.query_string_start_date,
			this.props.query_string_end_date,
			this.props.query_string_keyword
		]
				
		let filteredQueryParams = Object.keys(existingQueryParams)
				.filter(k => !queryParamsToRemove.includes(k))
				.map(k => Object.assign({}, {[k]: existingQueryParams[k]}))
				.reduce((res, o) => Object.assign(res, o), {});
		
		this.props.history.push({
		  search: qs.stringify(filteredQueryParams)
		});	
			
	}
	
	filter(){
		
		let query = {};
		
		let startDate = null;
		let endDate = null;
		let searchValue = null;
		
		// Proccess start/end date
		if(this.state.startDate !== null && this.state.endDate !== null){
			
			startDate = this.state.startDate.format('YYYY-MM-DD');
			endDate = this.state.endDate.format('YYYY-MM-DD');
			
			query[this.props.query_string_start_date] = startDate;
			query[this.props.query_string_end_date] = endDate;
		}
			
		// Process keyword search
		if(this.state.searchValue !== ""){
			searchValue = this.state.searchValue;
			query[this.props.query_string_keyword] = searchValue;
		}
		
		// Add query data to URL if there are any filters applied
		if(Object.keys(query).length > 0){
			const existingQueryParams = qs.parse(stripQueryStringSeperator(this.props.location.search))
			
			// Update Query String
			this.props.history.push({
			  search: qs.stringify(Object.assign({}, existingQueryParams, query))
			});			
			
		}

		// Send message to other widgets
		this.props.sendMultipleInterwidgetMessages([
			{
				messageType:INTERWIDGET_MESSAGE_TYPES.START_DATE,
				message:startDate
			},			
			{
				messageType:INTERWIDGET_MESSAGE_TYPES.END_DATE,
				message:endDate
			},
			{
				messageType:INTERWIDGET_MESSAGE_TYPES.KEYWORD_SEARCH,
				message:searchValue
			}
		])
		
	}	
	
	
	render() {
    
		return (  
			<div style={{"maxWidth":"535px", "display":"inline-flex", "float" : "right"}}>
			
				{/* Date Filter */}
				{
					(
						this.props.show_date_filter ? 
							<div style={{display:"inline-block", margin : "0 5px"}}>

								<DateRangePicker
									small={true}
									appendToBody 
									startDate={this.state.startDate} // momentPropTypes.momentObj or null,
									startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
									endDate={this.state.endDate} // momentPropTypes.momentObj or null,
									endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
									onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // 
									focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
									onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
									anchorDirection="right"
									isOutsideRange={ ()=> false }
								/>

							</div>
						:
							""
					)
				}
				
				{/* Keyword Filter */}				
				{
					(
						this.props.show_keyword_filter ?
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
				
				<div style={{display:"inline-block", margin : "0 0 0 5px"}} md={1}>
					<Button 
						onClick={this.clearFilters.bind(this)}
						style={{"height" : "36px", "borderRadius" : "0"}}
					>
						X
					</Button>
				</div>				
				
				<div style={{display:"inline-block", margin : "0 5px 0 0"}} md={1}>
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
        sendInterwidgetMessage: (messageType, message) => dispatch(sendInterwidgetMessage(messageType, message)),
        sendMultipleInterwidgetMessages: (messages) => dispatch(sendMultipleInterwidgetMessages(messages)),
        removeMultipleInterwidgetMessages: (messageTypes) => dispatch(removeMultipleInterwidgetMessages(messageTypes)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilteringWidget))
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import qs from 'query-string';
import moment from 'moment';
import { Button, FormControl } from 'react-bootstrap';

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
		
		let queryParams = qs.parse(this.props.location.search)
		
		let startDate = (queryParams.startDate === undefined) ? null : moment(queryParams.startDate)
		let endDate = (queryParams.endDate === undefined) ? null : moment(queryParams.endDate)

		this.state = ({loading:false, searchValue:"", startDate, endDate})
		

	}
	
	handleSearchChange(event) {
		this.setState({searchValue: event.target.value});
	}
	
	
	filter(){

		if(this.state.startDate !== null && this.state.endDate !== null){
		
		    const query = { 
				startDate : this.state.startDate.format('YYYY-MM-DD'), 
				endDate : this.state.endDate.format('YYYY-MM-DD'),
				search : this.state.searchValue
			};

			const searchString = qs.stringify(query);

			this.props.pushURL({
				search: searchString
			})
			
		}
	}	
	
	onFocusChanged(){
		
	}
	
	
	fetchData(){
		//console.log("get data")
	}
	
	render() {
    
		return (  
			<div style={{"maxWidth":"510px", "display":"inline-flex", "float" : "right"}}>
			
				<div style={{display:"inline-block", margin : "0 5px"}}>
					{/* Figure out how to get this into the header of the widget*/}
					<DateRangePicker
						small={true}
						appendToBody 
						startDate={this.state.startDate} // momentPropTypes.momentObj or null,
						startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
						endDate={this.state.endDate} // momentPropTypes.momentObj or null,
						endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
						onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
						focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
						onFocusChange={search => this.setState({ search })} // PropTypes.func.isRequired,
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
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(FakeWidget);
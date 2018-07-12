import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import qs from 'qs';
import { INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';
import { ArrayTabularDataAccessor, BulletedListFormatter } from '../../Helpers/ReactTableHelpers.js'
import Chart from 'chart.js';
 

// Data Table Imports
import ReactTable from "react-table";
import "react-table/react-table.css";

/*

I DONT LIKE HOW MY JSON DOUBLE DEFINES LABELS WITHIN EACH SERISE... THINK ABOUT THIS A LITTLE BIT MORE

*/

/**
 * Component for fetching data from a simple GET-based API and displaying it in a table.
 * Has support built in for facilitating pagination, filtering & sorting on the server side.
 */
class GraphingChartAPIWidget extends Component {
				
	constructor(state){
		super(state);

		this.state = ({
			loading:false, 
			table_loading:false, 
			data : {},
			options : {
				maintainAspectRatio: false
			}
		})
		
	}
		
	
	propTypes: {
		chartName 						: React.PropTypes.string,
		endpoint 						: React.PropTypes.string,
		apiPageNumberVariableName 		: React.PropTypes.string,
		apipointPageSizeVariableName 	: React.PropTypes.string,
		apipointSortVariableName 		: React.PropTypes.string,
		apipointFilterVariableName 		: React.PropTypes.string,
		apiResponseDataKey 				: React.PropTypes.string,
		apiResponseNumberofPagesKey 	: React.PropTypes.string,
		apiPageNumberOffset 			: React.PropTypes.number,
		queryStringPageVariableName 	: React.PropTypes.string,
		queryStringPageSizeVariableName	: React.PropTypes.string,
		queryStringFilterVariableName	: React.PropTypes.string,
		queryStringSortVariableName 	: React.PropTypes.string,
		
		
		
	}
	
	
	static defaultProps = {
		
		chartName						: "Sample Graph",
		
		// API Endpoint
		endpoint : "https://reqres.in/api/users",	
		
		// Parameters that are sent to API
		apiPageNumberVariableName 		: "page",
		apipointPageSizeVariableName 	: "per_page",
		apipointSortVariableName 		: "sort_by",
		apipointFilterVariableName 		: "filter_by",
		apiResponseDataKey 				: "data",
		apiResponseNumberofPagesKey 	: "total_pages",	
		apiPageNumberOffset 			: 1,
		
		// Query String Params that are added to current URL
		queryStringPageVariableName 	: "dage",
		queryStringPageSizeVariableName	: "page_size",
		queryStringFilterVariableName	: "filter_by",
		queryStringSortVariableName 	: "sort_by",
		

	}

	
	
	componentDidUpdate(prevProps, prevState) {
				
		/* Manually forcing a data fetch if requested dates change; during a rerender the onFetchData method of react-table isn't automatically called
		 */
		if(this.props.startDate !== prevProps.startDate || this.props.endDate !== prevProps.endDate){
			this.refReactTable.fireFetchData()
		} 
	}
	
	

	
	
	/**
	 * Fetch data from API and insert into table
	 */ 
	fetchData(state, instance){
		
		this.setState({table_loading: true})

		// Send request to API
		fetch(`${this.props.endpoint}`)
		.then(response => response.json())
		.then((response) => {

		
			let data = this.convertToChartFormat(response[this.props["apiResponseDataKey"]])
		
			this.setState({
				table_loading: false,
				data,
				//options - do this once you can parse out the options correctly
			})	

			this.drawGraph()
			
		})	

	}
	
	drawGraph(){
		
		var context = document.getElementById("chartjs3")
		
		let myChart = Chart.Bar(context, {
			options: this.state.options,
			data: this.state.data
		});

	}
	
	
	convertToChartFormat(customFormat){

		let labels = [];
		let all_axis_data = [];
		console.log(customFormat)
		
		for(let [index, series] of customFormat.entries()){
			

			
			
			let series_label = series.label;
			let series_data = []
			console.log(series)
			//let series_data = []
			//labels.push(item.label)
			
			
			for(let current_series_data of series.data){
				
				if(index === 0){
					labels.push(current_series_data.label)
				//get full graph labels
				}
				
				/*
				console.log(data)
				
				series_data.push({
					"x" : data.label,
					"y": data.data
				})
				
				*/
				
				series_data.push(current_series_data.data)
			
			}
			
			all_axis_data.push({
				label: series_label,
				data:series_data
			})
		}
		
		console.log(all_axis_data)
		
		let data = {
			labels,
			datasets:all_axis_data
			
		}
  
		console.log(data)
		
		return data
	}

	componentDidMount(){
		this.fetchData()
	}

	
	render() {
		
		//let columns = this.buildColumns()
		//
		
    
		return (  
			<FullWidget settings_button={false} close_button={true} title={this.props.tableName} loading={this.state.loading} {...this.props}>
				
				<div style={{"position":"relative", "height":"100%"}}>
					<canvas id="chartjs3"></canvas>
				</div>
				
			</FullWidget>
		);
	}
}


const mapStateToProps = (state) => {
    return {
		startDate: state.dashboard.widget_messages[INTERWIDGET_MESSAGE_TYPES.START_DATE],
		endDate: state.dashboard.widget_messages[INTERWIDGET_MESSAGE_TYPES.END_DATE],
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
		pushURL: (url) => dispatch(push(url)),
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(GraphingChartAPIWidget);
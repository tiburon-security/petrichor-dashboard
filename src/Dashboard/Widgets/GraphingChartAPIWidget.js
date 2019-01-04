import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {FullWidget} from '../WidgetStyles.js'
import { connect } from 'react-redux';
import qs from 'qs';
import { INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as chroma from 'chroma-js';
import merge from 'lodash/merge';
import sum from 'lodash/sum';

// ChartDataLabels plugin registers itself globally, so it's unregsitered and selectively enabled
Chart.plugins.unregister(ChartDataLabels);

/**
 * Component for fetching data from a simple GET-based API and displaying it in a table.
 * Has support built in for facilitating pagination, filtering & sorting on the server side.
 */
class GraphingChartAPIWidget extends Component {


	constructor(state){
		super(state);

		this.state = ({
			loading:false, 
			data : {},
			options : {}
		})
		
	}
	
	
	static propTypes = {
		chart_name 						: PropTypes.string,
		endpoint 						: PropTypes.string,
		graph_type 						: PropTypes.oneOf(['bar', 'pie', 'line']),
		graph_colors 					: PropTypes.array,
		graph_border_colors				: PropTypes.array,
		show_legend						: PropTypes.bool,
		start_from_zero					: PropTypes.bool,
		auto_skip_xaxis_labels			: PropTypes.bool,
		truncate_xaxis_label_length		: PropTypes.number,
		show_percentage_labels			: PropTypes.bool,
		custom_chart_options			: PropTypes.object,
		api_response_data_key 			: PropTypes.string,
		
		api_filter_variable_name 			: PropTypes.string,
		api_start_date_variable_name	 	: PropTypes.string,
		api_end_date_variable_name	 		: PropTypes.string,
	}
	
	
	static defaultProps = {
		
		chart_name						: "Sample Graph",
		
		// API Endpoint
		endpoint : "https://reqres.in/api/users",	
		
		// Type of graph to display (bar || pie || line)
		graph_type				 		: "bar",
		
		// Possible colors for the graph elements, defined as Hex strings
		graph_colors					: [
			"#26b99a",
			"#3498db",
			"#455c73",
			"#9b59b6",
			"#bdc3c7"
		],		
		
		// Possible colors for the graph elements, defined as Hex strings
		graph_border_colors					: [
			"#26b99a",
			"#3498db",
			"#455c73",
			"#9b59b6",
			"#bdc3c7"
		],
		
		// Show legend on graph
		show_legend						: false,
		
		// Start graph numbering for zero (bar & graph)
		start_from_zero					: false,
		
		// Maximize space and skip xaxis labels to condense graph
		auto_skip_xaxis_labels			: false,		
		
		// Truncate xaxis labels to this size
		truncate_xaxis_label_length		: 10,
		
		// Only applicable for pie graphs
		show_percentage_labels			: true,
		
		custom_chart_options			: null,
		
		// Parameters that are sent to API
		api_response_data_key 				: "data",
		api_filter_variable_name 			: "filter",
		api_start_date_variable_name	 	: "start_date",
		api_end_date_variable_name	 		: "end_date"
	}

	
	
	componentDidUpdate(prevProps, prevState) {
				
		// Manually forcing a data fetch if requested dates change
		if(this.props.startDate !== prevProps.startDate || this.props.endDate !== prevProps.endDate){
			this.fetchData()
		} 
	}
	
	
	/**
	 * Fetch data from API and insert into table
	 */ 
	fetchData(state, instance){
		
		// Track the query string that is used as GET parameters for the API
		let apiQueryStringObj = {};
		let apiQueryStringObjFilters = [];
		
		this.setState({loading: true})
		
		// Build filters cause by external actions (i.e. date being dispatched by FilteringWidget)
		if(this.props.startDate !== undefined && this.props.endDate !== undefined){
			apiQueryStringObjFilters.push(`${this.props.api_start_date_variable_name}[ge]${this.props.startDate}`)
			apiQueryStringObjFilters.push(`${this.props.api_end_date_variable_name}[le]${this.props.endDate}`)
		}
			
		if(apiQueryStringObjFilters.length > 0){
			apiQueryStringObj[this.props.api_filter_variable_name] = apiQueryStringObjFilters.join(",")
		}
		
		// Convert query string objects into actual GET paramter query strings
		const apiQueryString = qs.stringify(apiQueryStringObj);

		// Send request to API
		fetch(`${this.props.endpoint}?${apiQueryString}`)
		.then(response => response.json())
		.then((response) => {

			let data = this.convertToChartFormat(response[this.props["api_response_data_key"]])
			let options = this.convertToChartOptions();
		
			this.setState({
				loading: false,
				data,
				options
			})	

			this.drawGraph()
			
		})	

	}
	
	
	/**
	 * Function for ensuring that each series has a different set of colors based on some user
	 * defined set of colors; this is done by modifying the saturation. Also ensures that the same 
	 * color isn't reused within each dataset by darkening it
	 */
	generateColors(baseColors, opacity, numberOfDatasets, numberOfElementsPerDataset){
		
		let increasePerPass = .1;
		let decreasePerDataset = 5;
		
		let output = {};
			
		
		// Step 1 - Track base colors for each dataset & initiate counter of number of times each color has been used
		let numberOfPasses = {}
		for(let i=0; i<numberOfDatasets; i++){
						
			let currentDataset = {}
			
			for(let j=0; j<baseColors.length; j++){

				let lightenedBaseColor = chroma(baseColors[j]).saturate(i * decreasePerDataset).hex()
				currentDataset[lightenedBaseColor] = 0
			}
			
			numberOfPasses[i] = currentDataset;
		}
		

		// Step 2 - Generate new color sets
		for(let i=0; i<numberOfDatasets; i++){
						
			let currentDataset = numberOfPasses[i];
			let currentDataSetKeys = Object.keys(currentDataset)
			
			let newColors = []
			
			for(let j=0; j<numberOfElementsPerDataset; j++){

				let currentItemKey = currentDataSetKeys[j % baseColors.length]
				let currentItem = currentDataset[currentItemKey]
				let darkenedColor = null;
				
				if(currentItem === 0){
					
					darkenedColor = currentItemKey
					
					// Update color counter
					numberOfPasses[i][currentItemKey] = numberOfPasses[i][currentItemKey] + 1
					
				} else {
								
					darkenedColor = chroma(currentItemKey).darken(currentItem + increasePerPass).hex()
					
					// Update color counter
					numberOfPasses[i][currentItemKey] = numberOfPasses[i][currentItemKey] + 1
				}
				
				newColors.push(darkenedColor)
				
			}
			
			output[i] = newColors
		}	
		
		// Step 3 - Apply opacities, if one provided
		if(opacity !== null){
			
			let outputWithOpacity = {}
			
			for(let series of Object.keys(output)){
				
				let updatedColorArray = [];
				
				for(let color of output[series]){
					updatedColorArray.push(chroma(color).alpha(opacity).css())
				}
				
				outputWithOpacity[series] = updatedColorArray;
				
			}

			output = outputWithOpacity;
		}
		
		return output
		
	}
	
	drawGraph(){
		
		var context = document.getElementById("chartjs3-" + this.props.widget_key)
		
		let plugins = [];
		
		if(this.props.show_percentage_labels && this.props.graph_type === 'pie'){
			plugins.push(ChartDataLabels)
		}
		
		new Chart(context, {
			type: this.props.graph_type,
			options: this.state.options,
			data: this.state.data,
			plugins: plugins
		});

	}
	
	
	convertToChartFormat(customFormat){

		let labels = [];
		let all_axis_data = [];
		
		let dataToParse = null
		let backgroundColors = null;
		let borderColors = null;

		// Options vary slightly between pie, bar, and line charts
		if(this.props.graph_type === 'pie'){
			
			// If the graph type is a pie, we only select the first series, 
			// if multiple are provided by the user
			dataToParse = [customFormat[0]]
			
			backgroundColors = (this.props.graph_colors.length > 0 ? this.generateColors(this.props.graph_colors, null, dataToParse.length, dataToParse[0].data.length) : [])
			borderColors = (this.props.graph_border_colors.length > 0 ? this.generateColors(this.props.graph_border_colors, null, dataToParse.length, dataToParse[0].data.length) : [])
		
		} else if(this.props.graph_type === 'bar'){
			
			// Keep all the series if it's a bar or line
			dataToParse = customFormat;
			
			backgroundColors = (this.props.graph_colors.length > 0 ? this.generateColors(this.props.graph_colors, null, dataToParse.length, dataToParse[0].data.length) : [])
			borderColors = (this.props.graph_border_colors.length > 0 ? this.generateColors(this.props.graph_border_colors, null, dataToParse.length, dataToParse[0].data.length) : [])
			
		} else if (this.props.graph_type === 'line'){
			
			// Keep all the series if it's a bar or line
			dataToParse = customFormat;
			
			// Force the opacity to be half for the background
			let opacity = .5;
			
			// Entire series line has to be the same color, so we coerce this
			// by indicating to the color generator function that there is only a single
			// element in the series
			let numberOfElementsPerDataset = 1;
			
			backgroundColors = (this.props.graph_colors.length > 0 ? this.generateColors(this.props.graph_colors, opacity, dataToParse.length, numberOfElementsPerDataset) : [])
			borderColors = (this.props.graph_border_colors.length > 0 ? this.generateColors(this.props.graph_border_colors, null, dataToParse.length, numberOfElementsPerDataset) : [])
			
		}

		// Build the actual serise data required by chartjs
		for(let [index, series] of dataToParse.entries()){
			
			let seriesLabel = series.label;
			let seriesData = []

			for(let currentSeriesData of series.data){
				
				if(index === 0){
					labels.push(currentSeriesData.label)
				}
				
				seriesData.push(currentSeriesData.data)
			
			}
			
			// Set colors for elements
			let seriesColors = []
			for(let i=0; i<seriesData.length; i++){
				seriesColors.push(this.props.graph_colors[i % this.props.graph_colors.length]);
			}
			
			all_axis_data.push({
				label: seriesLabel,
				data:seriesData,
				backgroundColor: backgroundColors[index],
				borderColor: borderColors[index]
			})
		}
				
		let data = {
			labels,
			datasets:all_axis_data
		}
  		
		return data
	}
	
	
	/**
	 * Generates ChartJS options based on props
	 */
	convertToChartOptions(){
		
		// Array of option objects that will be deeply merged to form final options object
		let newOptionsArray = []
		
		let options =  {
			maintainAspectRatio: false,
			legend: {
				display: this.props.show_legend
			}
		}

		// Force the graph to always start at 0
		if(this.props.start_from_zero){
			newOptionsArray.push(
				{
					scales : {
						yAxes: [{
							ticks: {
								beginAtZero: this.props.start_from_zero
							}
						}]
					}
				}
			);
		}
		
		// Skips xaxis labels to condense space on graph
		if(!this.props.auto_skip_xaxis_labels){
			newOptionsArray.push(
				{
					"scales": {
						"xAxes": [{
							"ticks": {
								"autoSkip": false
							}
						}]
					}
				}
			);
		}
		
		// Truncate non-pie graphs to user specified length, and enable tooltips showing full title
		if(this.props.graph_type !== 'pie'){
		
			let truncate_length = this.props.truncate_xaxis_label_length;
			
			newOptionsArray.push(
				{
					"scales": {
						"xAxes": [{
							"ticks": {
								callback: function(value) {
									return value.substr(0, truncate_length);
								},
							}
						}]
					},
					tooltips: {
						enabled: true,
						mode: 'label',
						callbacks: {
							title: function(tooltipItems, data) {
								var idx = tooltipItems[0].index;
								return  data.labels[idx];
							}
						}
					}
				}
			);	
		}

		// Shows percentages on pie chart
		if(this.props.show_percentage_labels){
			newOptionsArray.push(		
				{
					plugins: {
						datalabels: {
							color: '#FFFFFF',
							formatter: function(value, context) {
								return + Math.round((value/sum(context.dataset.data))*100) + '%';
							}
						}
					}
				}
			)
		}
				
		// Implement custom override by merging prop controlled options and custom options objects
		if(this.props.custom_chart_options !== null){
			newOptionsArray.push(this.props.custom_chart_options)
		}
		
		options = merge(options, ...newOptionsArray)
		
		return options;
		
	}

	componentDidMount(){
		this.fetchData()
	}

	
	render() {
    
		return (  
			<FullWidget settings_button={false} close_button={true} title={this.props.chart_name} loading={this.state.loading} {...this.props}>
				
				<div style={{"position":"relative", "height":"100%"}}>
					<canvas id={"chartjs3-" + this.props.widget_key}></canvas>
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


export default connect(mapStateToProps, null)(GraphingChartAPIWidget);
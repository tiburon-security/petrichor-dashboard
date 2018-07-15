import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'
import { connect } from 'react-redux';
import qs from 'qs';
import { INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';
import Chart from 'chart.js';
import * as chroma from 'chroma-js';


/*

TODO:
- create props for toggling legend, start_from_zero(applicable for bar graphs)
- add support for date ranges i.e., DateRangeFilter picks a date, relay selected date to the API backing this widget so the data reflects it. Use standard filter syntax used by other sample widgets
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
				maintainAspectRatio: false,
				legend: {
					display: false
				}
			}
		})
		
	}
		
	
	propTypes: {
		chartName 						: React.PropTypes.string,
		endpoint 						: React.PropTypes.string,
		graph_type 						: React.PropTypes.string,
		graph_colors 					: React.PropTypes.array,
		graph_border_colors				: React.PropTypes.array,
		
		apipointFilterVariableName 		: React.PropTypes.string,
		apiResponseDataKey 				: React.PropTypes.string,

	}
	
	
	static defaultProps = {
		
		chartName						: "Sample Graph",
		
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
		
		// Parameters that are sent to API
		apipointFilterVariableName 		: "filter_by",
		apiResponseDataKey 				: "data",

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
		
		var context = document.getElementById("chartjs3")
		
		new Chart(context, {
			type: this.props.graph_type,
			options: this.state.options,
			data: this.state.data
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
			dataToParse = customFormat[0]
			
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

	componentDidMount(){
		this.fetchData()
	}

	
	render() {
    
		return (  
			<FullWidget settings_button={false} close_button={true} title={this.props.chartName} loading={this.state.loading} {...this.props}>
				
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


export default connect(mapStateToProps, null)(GraphingChartAPIWidget);
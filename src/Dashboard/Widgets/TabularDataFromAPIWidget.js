import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import qs from 'query-string';
import { INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';
import { ArrayTabularDataAccessor, BulletedListFormatter } from '../../Helpers/ReactTableHelpers.js'

// Data Table Imports
import ReactTable from "react-table";
import "react-table/react-table.css";



/**
 * Component for fetching data from a simple GET-based API and displaying it in a table.
 * Has support built in for facilitating pagination, filtering & sorting on the server side.
 */
class TabularDataFromAPIWidget extends Component {
				
	constructor(state){
		super(state);
		
		({defaultPage: this.defaultPage, defaultPageSize: this.defaultPageSize, defaultSorts: this.defaultSorts, defaultFilters: this.defaultFilters} = this.getDefaultTableSettings());	

		this.state = ({
			loading:false, 
			table_loading:false, 
			page: this.defaultPage,
			pages:-1,
			data:[]
		})
		
	}
		
	
	propTypes: {
		tableName 						: React.PropTypes.string,
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
		
		
		/**
		 Array of column defintions to display in table
			[
			
				* For a standard column, simply list the display label, and the object key
				* that is represents within the dataset
				{
					"label": "Last Name",
					"id": "last_name"
				},
				
				* There is also support for custom accessors, for accessing nested data
				* In this case, use the ArrayTabularDataAccessor, which also requires
				* that the nested data be identified by a display label and object key.
				* When using a custom accessor, you likely also need a custom data formatter
				* to display the data. For example, ArrayTabularDataAccessor returns an array of 
				* objects, which react-table can't natively display. For this, the BulletedListFormatter 
				* was developed to display ArrayTabularDataAccessor data as a bulleted list within a single
				* column in the table.
				{
					"label" : "Siblings",
					"id": "siblings",
					"custom_accessor":  {
						"method" : "ArrayTabularDataAccessor",
						"keys" : [
							{
								"label" : "First Name",
								"key" : "first_name"										
							},										
							{
								"label" : "Last Name",
								"key" : "last_name"										
							}
						],
						"formatter" : {
							"method": "BulletedListFormatter",
							"show_label" : false
						}
					}
				}
			]		
		 */
		columns 						: React.PropTypes.array
	}
	
	
	static defaultProps = {
		
		tableName						: "Sample Table",
		
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
		
		// Columns to display
		columns : [
			{
			  Header: "ID",
			  accessor: "id"
			},          
			{
			  Header: "First Name",
			  accessor: "first_name"
			},
			{
			  Header: "Last Name",
			  accessor: "last_name"
			}
		]
	}
	
	
	/**	
	 * Turns the custom column proprs format into the column definition required by react-table
	 * Note: this doesn't fail gracefully if the custom props format isn't perfect
	 */
	buildColumns(){
		
		let output = []
		
		for(let col of this.props.columns){
			
			let obj = {
				Header : col.label,
				id: col.id,
				accessor: col.id // Defaulty make accessor the ID
			}
			
			// Determine if a custom accessor function is being utilized
			if("custom_accessor" in col){
				
				switch(col.custom_accessor.method){
					
					case "ArrayTabularDataAccessor": {
						obj["accessor"] =  (d =>  ArrayTabularDataAccessor(d, col.id, col.custom_accessor.keys))
						break;
					}					
				
					default : {
						obj["accessor"] = col.id;
						break;
					}
				
				}
				
				// Determine if a custom output formatter function is being utilized
				if("formatter" in col.custom_accessor){
					
					// Generates an array of the target keys that will be displayed
					let targetKeys = col.custom_accessor.keys.map((i) => {
						return i["label"]
					})
					
					let showLabel = col.custom_accessor.formatter.show_label;
					
					// Filteres a dataset to return only the target data that will be displayed
					let filterData = ( val => {
						
						let targetData = val.row[col.id].map((i) => {
							let filteredObj = {};

							for(let key of targetKeys){
								if(key in i){
									filteredObj[key] = i[key];
								}
							}
							
							return filteredObj;
						})						
						
						return targetData;
					})
					
					// Display data based on the specified custom formatter
					switch(col.custom_accessor.formatter.method){
						
						case "BulletedListFormatter": {
							obj["Cell"] = ( val => {
								
								let filteredData = filterData(val)								
								
								return BulletedListFormatter(filteredData, showLabel)
							})
							break;
						}
						
						default : {
							break;
						}	
					}
				}
			}
			output.push(obj)	
		}
		return output;
	}
	
	
	componentDidUpdate(prevProps, prevState) {
				
		/* Manually forcing a data fetch if requested dates change; during a rerender the onFetchData method of react-table isn't automatically called
		 */
		if(this.props.startDate !== prevProps.startDate || this.props.endDate !== prevProps.endDate){
			this.refReactTable.fireFetchData()
		} 
	}
	
	
	/**
	 * Build initial table state based on query string parameters
	 */	
	getDefaultTableSettings(){
		
		let defaultPage = 0;
		let defaultPageSize = 5;
		let defaultSorts = [];
		let defaultFilters = []; 
		 
		// Grab initial query string to see if any defaults need to be set for table
		let queryParams = qs.parse(this.props.location.search)
				
		// Parse page number
		if(queryParams[this.props.queryStringPageVariableName] !== undefined){
			defaultPage = Number.parseInt(queryParams[this.props.queryStringPageVariableName], 10) - this.props.apiPageNumberOffset;
		}		
		
		// Parse page size number
		if(queryParams[this.props.queryStringPageSizeVariableName] !== undefined){
			defaultPageSize = Number.parseInt(queryParams[this.props.queryStringPageSizeVariableName], 10);
		}
		
		// Parse out initial sorts
		if(queryParams[this.props.queryStringSortVariableName] !== undefined){
			
			let desc_regex_pattern = /desc\((.*)\)/g;
			let asc_regex_pattern = /asc\((.*)\)/;
			
			defaultSorts = queryParams[this.props.queryStringSortVariableName].split(",").map(i=>{
				let descMatches = desc_regex_pattern.exec(i);
				if(descMatches !== null){
					return {
						id: descMatches[1],
						desc: true
					}	
				} else {
					let ascMatches = asc_regex_pattern.exec(i);
					return {
						id: ascMatches[1],
						desc: false						
					}
				}							
			})		
		}
		
		// Parse out initial filters
		if(queryParams[this.props.queryStringFilterVariableName] !== undefined){
			defaultFilters = queryParams[this.props.queryStringFilterVariableName].split(",").map(i=>{
				let split = i.split("[eq]");
				let column = split[0]
				let value = split[1]
				return {
					id : column,
					value
				}
			})
		}

		return {defaultPage, defaultPageSize, defaultSorts, defaultFilters};		
	}
	
	
	/**
	 * Fetch data from API and insert into table
	 */ 
	fetchData(state, instance){

		// Tracks query string for the current page
		let thisQueryStringObj = {};
		
		// Trakc the query string that is used as GET parameters for the API
		let apiQueryStringObj = {};
		
		this.setState({table_loading: true})

		thisQueryStringObj[this.props.queryStringPageVariableName] 	= state.page + this.props.apiPageNumberOffset;
		thisQueryStringObj[this.props.queryStringPageSizeVariableName] = state.pageSize;		
		
		apiQueryStringObj[this.props.apiPageNumberVariableName] 	= state.page + this.props.apiPageNumberOffset;
		apiQueryStringObj[this.props.apipointPageSizeVariableName] = state.pageSize;

		// Build sorting query string parameters
		if(state.sorted.length > 0){
			let sorts = state.sorted.map(i=>{
				let direction = (i.desc ? "desc" : "asc")
				return `${direction}(${i.id})`
			}).join(",")
			
			thisQueryStringObj[this.props.queryStringSortVariableName] = sorts
			apiQueryStringObj[this.props.apipointSortVariableName] = sorts
		}
		
		// Build filtering query string parameters
		let filters = []
		
		// Build filters caused by an table-specific actions
		if(state.filtered.length > 0){
			filters = state.filtered.map(i=>{
				return `${i.id}[eq]${i.value}`
			})
		}
		
		// Build filters cause by external actions (i.e. date being dispatched by FilteringWidget)
		if(this.props.startDate !== undefined && this.props.endDate !== undefined){
			filters.push(`start_date[eq]${this.props.startDate}`)
			filters.push(`end_date[eq]${this.props.endDate}`)
		}
		
		if(filters.length > 0){
			thisQueryStringObj[this.props.queryStringFilterVariableName] = filters.join(",")
			apiQueryStringObj[this.props.apipointFilterVariableName] = filters.join(",")
		}
		
		// Convert query string objects into actual GET paramter query strings
		const thisQueryString = qs.stringify(thisQueryStringObj);
		const apiQueryString = qs.stringify(apiQueryStringObj);

		// Send request to API
		fetch(`${this.props.endpoint}?${apiQueryString}`)
		.then(response => response.json())
		.then((response) => {

			this.setState({
				data: response[this.props.apiResponseDataKey],
				pages: response[this.props.apiResponseNumberofPagesKey],
				table_loading: false
			})
		})	

		// Add any currently selected parameters to the URL as a query string
		this.props.pushURL({
			search: thisQueryString
		})
	}

	
	render() {
		
		let columns = this.buildColumns()
		
    
		return (  
			<FullWidget settings_button={false} close_button={true} title={this.props.tableName} loading={this.state.loading} {...this.props}>
				
				<ReactTable
				
					// Create a reference to react-table which will allow for manually calling forceFetchData()
					ref={(refReactTable) => {this.refReactTable = refReactTable;}}
				
					manual // informs React Table that you'll be handling sorting and pagination server-side
				
					//columns={this.props.columns}
					columns={columns}
					data={this.state.data} // should default to []
					
					pages={this.state.pages} // should default to -1 (which means we don't know how many pages we have)
					loading={this.state.table_loading}
					minRows={0}
					defaultPageSize={this.defaultPageSize}
					filterable
					onFetchData={(state, instance) => {
						this.fetchData(state, instance)
					}}

					className="-striped -highlight"
					style={{
						height: "100%" // This will force the table body to overflow and scroll, since there is not enough room
					}}
					
					defaultFiltered={this.defaultFilters}
					defaultSorted={this.defaultSorts}
				
				/>	
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


export default connect(mapStateToProps, mapDispatchToProps)(TabularDataFromAPIWidget);
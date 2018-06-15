import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import qs from 'query-string';
import { INTERWIDGET_MESSAGE_TYPES } from '../../redux/actions/Dashboard.js';

// Data Table Imports
import ReactTable from "react-table";
import "react-table/react-table.css";



/***

1 (DONE) - if the page has no initial date, the start/end doesnt get added to the API call, but if it does have an initial, it does
2 (DONE) - find a way to parse an url query params from initial load and read them into table configuration (like updating the filter)
3 - find a way to save table parameters to URL, simply slapping the params passed to the api to the current pages query params is kinda sloppy...



***/

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
		endpoint : React.PropTypes.string,
		apiPageNumberVariableName : React.PropTypes.string,
		apipointPageSizeVariableName : React.PropTypes.string,
		apipointSortVariableName : React.PropTypes.string,
		apipointFilterVariableName : React.PropTypes.string,
		apiResponseDataKey : React.PropTypes.string,
		apiResponseNumberofPagesKey : React.PropTypes.string,
		apiPageNumberOffset : React.PropTypes.number,
		columns : React.PropTypes.array
	}
	
	
	static defaultProps = {
		endpoint : "https://reqres.in/api/users",	
		apiPageNumberVariableName : "page",
		apipointPageSizeVariableName : "per_page",
		apipointSortVariableName : "sort_by",
		apipointFilterVariableName : "filter_by",
		apiResponseDataKey : "data",
		apiResponseNumberofPagesKey : "total_pages",	
		apiPageNumberOffset : 1,
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
		
		const PAGE_QUERY_STRING_NAME 		= "page";
		const PAGE_SIZE_QUERY_STRING_NAME 	= "page_size";
		const FILTER_QUERY_STRING_NAME 		= "filter_by";
		const SORT_QUERY_STRING_NAME 		= "sort_by";
		
		let defaultPage = 0;
		let defaultPageSize = 5;
		let defaultSorts = [];
		let defaultFilters = []; 
		 
		// Grab initial query string to see if any defaults need to be set for table
		let queryParams = qs.parse(this.props.location.search)
		
		console.log(queryParams)
		
		// Parse page number
		if(queryParams[PAGE_QUERY_STRING_NAME] !== undefined){
			defaultPage = Number.parseInt(queryParams[PAGE_QUERY_STRING_NAME], 10) - this.props.apiPageNumberOffset;
		}		
		
		// Parse page size number
		if(queryParams[PAGE_SIZE_QUERY_STRING_NAME] !== undefined){
			defaultPageSize = Number.parseInt(queryParams[PAGE_SIZE_QUERY_STRING_NAME], 10);
		}
		
		// Parse out initial sorts
		if(queryParams[SORT_QUERY_STRING_NAME] !== undefined){
			
			let desc_regex_pattern = /desc\((.*)\)/g;
			let asc_regex_pattern = /asc\((.*)\)/;
			
			defaultSorts = queryParams[SORT_QUERY_STRING_NAME].split(",").map(i=>{
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
		if(queryParams[FILTER_QUERY_STRING_NAME] !== undefined){
			defaultFilters = queryParams[FILTER_QUERY_STRING_NAME].split(",").map(i=>{
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
		
		this.setState({table_loading: true})
		
		// Generate query string
		const queryString = { 
			[this.props.apiPageNumberVariableName] : state.page + this.props.apiPageNumberOffset, 
			[this.props.apipointPageSizeVariableName] : state.pageSize,
		};

		// Build sorting query string parameters
		if(state.sorted.length > 0){
			let sorts = state.sorted.map(i=>{
				let direction = (i.desc ? "desc" : "asc")
				return `${direction}(${i.id})`
			}).join(",")
			queryString[this.props.apipointSortVariableName] = sorts
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
			queryString[this.props.apipointFilterVariableName] = filters.join(",")
		}
		
		// Convert query string object into actual GET paramter query string
		const searchString = qs.stringify(queryString);
		console.log(searchString)

		fetch(`${this.props.endpoint}?${searchString}`)
		.then(response => response.json())
		.then((response) => {

			this.setState({
				data: response.data,
				pages: response[this.props.apiResponseNumberofPagesKey],
				table_loading: false
			})
		})	

		// Add any currently selected parameters to the URL as a query string
		this.props.pushURL({
			search: searchString
		})
	}

	
	render() {
    
		return (  
			<FullWidget settings_button={true} close_button={true} title="TabularDataFromAPIWidget" loading={this.state.loading} {...this.props}>
				
				<ReactTable
				
					// Create a reference to react-table which will allow for manually calling forceFetchData()
					ref={(refReactTable) => {this.refReactTable = refReactTable;}}
				
					manual // informs React Table that you'll be handling sorting and pagination server-side
				
					columns={this.props.columns}
					data={this.state.data} // should default to []
					
					page={this.state.page}
					pages={this.state.pages} // should default to -1 (which means we don't know how many pages we have)
					loading={this.state.table_loading}
					minRows={0}
					defaultPageSize={this.defaultPageSize}
					filterable
					onFetchData={(state, instance) => {
						this.fetchData(state, instance)
					}}
					onPageChange={page => this.setState({ page })}

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
import React, { Component } from 'react';
import {FullWidget} from '../WidgetStyles.js'
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import qs from 'query-string';
import moment from 'moment';


// Data Table Imports
import ReactTable from "react-table";
import "react-table/react-table.css";



class TabularDataFromAPIWidget extends Component {
		
	constructor(state){
		super(state);
		
		let queryParams = qs.parse(this.props.location.search)
		
		//console.log(queryParams.startDate)
		let startDate = (queryParams.startDate === undefined) ? null : moment(queryParams.startDate)
		let endDate = (queryParams.endDate === undefined) ? null : moment(queryParams.endDate)
		//console.log(startDate)

		this.state = ({
			loading:false, 
			table_loading:false, 
			page: 0,
			pages:-1,
			chunk_size:5,
			startDate, 
			endDate,
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

	
	render() {
		
		console.log("rendered")
    
		return (  
			<FullWidget settings_button={true} close_button={true} title="TabularDataFromAPIWidget" loading={this.state.loading} {...this.props}>
				
				<ReactTable
				
					manual // informs React Table that you'll be handling sorting and pagination server-side
				
					columns={this.props.columns}
					data={this.state.data} // should default to []
					pages={this.state.pages} // should default to -1 (which means we don't know how many pages we have)
					loading={this.state.table_loading}
					minRows={0}
					defaultPageSize={5}
					filterable
					
					onFetchData={(state, instance) => {
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
						if(state.filtered.length > 0){
							let filters = state.filtered.map(i=>{
								return `${i.id}[eq]${i.value}`
							}).join(",")
							queryString[this.props.apipointFilterVariableName] = filters
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
					}}

					className="-striped -highlight"
					style={{
						height: "100%" // This will force the table body to overflow and scroll, since there is not enough room
					}}
				/>
				
			</FullWidget>
		);
  
	}

}


const mapStateToProps = (state) => {
    return {

    };
};


const mapDispatchToProps = (dispatch) => {
    return {

    };
};


export default connect(mapStateToProps, mapDispatchToProps)(TabularDataFromAPIWidget);
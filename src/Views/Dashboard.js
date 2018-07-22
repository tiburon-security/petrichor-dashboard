import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {uniqueId } from 'lodash';
import ReactGridLayout, {WidthProvider}  from 'react-grid-layout';
import { connect } from 'react-redux';
import { addDashboardWidget, removeDashboardWidget, removeDashboardWidgetsAll, setDashboardColumnNumber, setDashboardRowHeight } from '../redux/actions/Dashboard.js';
const AutoWidthReactGridLayout = WidthProvider(ReactGridLayout);


/**
 * View that displays a customizable, draggable dashboard grid of user defined widgets.
 * Widgets are loaded according to the global application configuration (routes_menu_config), 
 * which defines what widgets will load on a given route.
 */
class Dashboard extends Component {
		
	static propTypes = {
		draggable_handle : PropTypes.string,
	}
	
	static defaultProps = {
		draggable_handle : ".widget_draggabble_area"		
	}
	
	
	/**
	 * Searches the dashboard for an element with the given key, removing it if found.
	 */
	closeWidget(key){
		this.props.removeDashboardWidget(key)		
	}
	
	
	/**
	 * Selects the current dashboard from the global configuration based on the active route_name
	 */
	findCurrentDashboard(currentRouteName){
		for (let dashboard of window.app_config.dashboards) {
			if(dashboard.route_name === currentRouteName){
				return dashboard
			}
		};	
	}
	
	
	/**
	 * Selects the configuration for a widget in the global configuration based on the widget's name
	 */
	findWidgetConfiguration(widgetName){
		for (let widget of window.app_config.dashboard_widgets) {
			if(widget.widget_class_name === widgetName){
				return widget
			}
		};			
	}
	

	/**
	 * Renders all of the widgets from the application configuration into the dashboard
	 */
	renderWidgets(){
				
		let currentRouteName = this.props.route_name;		
		
		// Finds config info for the current dashboard
		let currentDashboard = this.findCurrentDashboard(currentRouteName);
		
		// Use dashboard settings, if provided
		let rowHeight = (typeof currentDashboard.row_height !== "undefined" ? currentDashboard.row_height : this.props.rowHeight);
		let numColumns = (typeof currentDashboard.number_of_columns !== "undefined" ? currentDashboard.number_of_columns : this.props.numberOfColumns);

		this.props.setDashboardColumnNumber(numColumns)
		this.props.setDashboardRowHeight(rowHeight)

		
		// TODO: Write routine for dynamically generating layout
		if(currentDashboard.auto_position){
			
			// TODO
			
		} else {
			
			// Iterate every widget and load it
			for (let widget of currentDashboard.supported_widgets) {	
			
				let widgetConfiguration = this.findWidgetConfiguration(widget.name);

				let x = widget.layout.x;
				let y = widget.layout.y;
				let w = (typeof widget.layout.w === 'undefined' ? widgetConfiguration.min_grid_size.w : widget.layout.w);
				let h = (typeof widget.layout.h === 'undefined' ? widgetConfiguration.min_grid_size.h : widget.layout.h);
				
				let widgetProps = (typeof widget.props === 'undefined' ? [] : widget.props)
				
				let isDraggable = (typeof widget.layout.isDraggable === 'undefined' ? true : widget.layout.isDraggable);
				let isResizable = (typeof widget.layout.isResizable === 'undefined' ? true : widget.layout.isResizable);

				// Dynamically load Widget module
				require.ensure([], () => {  
				
					// Widgets live up one directory from Dashbaord.js in /Dashboard/Widgets/
					let Widget = require("../" + widgetConfiguration.widget_url);
					
					let containerKey = uniqueId();
					
					let widgetComponent = (
						<Widget.default 
							key={uniqueId()} 
							widget_key={containerKey} 
							route={this.props.route} 
							route_params={this.props.routeParams} 
							close_button_clickhandler={() => { this.closeWidget(containerKey)}} 
							{...widgetProps}
							{...this.props}
						/>
					);
					
					this.props.addDashboardWidget(containerKey, x, y, w, h, isDraggable, isResizable, widgetComponent);
				}); 
			}			
		}
	}
	
	/**
	 * Clears dashboard if a new route was requested
	 */
	componentDidUpdate(prevProps, prevState){
		if(this.props.route_name !== prevProps.route_name && this.props.match.url !== prevProps.match.url){
			// Clear dashboard re-rendering widgets
			this.props.removeDashboardWidgetsAll()
			this.renderWidgets()
			
		} 

	}
	
	
	/**
	 * On initial page load, render the dashboard
	 */
	componentDidMount(){
		this.renderWidgets()
	}
	
	
	/**
	 *Clears dashboard if a non-dashboard UI is being displayed
	 */
	componentWillUnmount(){
		this.props.removeDashboardWidgetsAll()
	}

	
	render() {
		return (
		  <div>
			<AutoWidthReactGridLayout  
				measureBeforeMount={true} 
				className="layout" 
				cols={this.props.numberOfColumns} 
				rowHeight={this.props.rowHeight} 
				draggableHandle={this.props.draggable_handle}
			>
			
				{/* Build widgets based on state */}
				{this.props.widgets.map((widget, i) => 
					<div key={widget.id} data-grid={{x: widget.x, y: widget.y, w: widget.w, h: widget.h, isDraggable:widget.isDraggable, isResizable: widget.isResizable}} children={widget.component} />
				)} 
				
			</AutoWidthReactGridLayout >	
		  </div>
		);
	}
}

const mapStateToProps = (state) => {
    return {
        widgets: state.dashboard.widgets,
        numberOfColumns: state.dashboard.numberOfColumns,
        rowHeight: state.dashboard.rowHeight
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addDashboardWidget: (id, x, y, w, h, isDraggable, isResizable, component) => dispatch(addDashboardWidget(id, x, y, w, h, isDraggable, isResizable, component)),
        removeDashboardWidget: (id) => dispatch(removeDashboardWidget(id)),
        removeDashboardWidgetsAll: () => dispatch(removeDashboardWidgetsAll()),
        setDashboardColumnNumber: (numberOfColumns) => dispatch(setDashboardColumnNumber(numberOfColumns)),
        setDashboardRowHeight: (rowHeight) => dispatch(setDashboardRowHeight(rowHeight))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
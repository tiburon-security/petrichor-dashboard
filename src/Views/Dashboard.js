import React, { Component } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {uniqueId } from 'lodash';
import ReactGridLayout, {WidthProvider}  from 'react-grid-layout';
const AutoWidthReactGridLayout = WidthProvider(ReactGridLayout);

/**
 * View that displays a customizable, draggable dashboard grid of user defined widgets.
 * Widgets are loaded according to the global application configuration (routes_menu_config), 
 * which defines what widgets will load on a given route.
 */
export class Dashboard extends Component {
	
	constructor(props){
		
		super(props);
		
		this.state = {
			rendered_widgets : [],
			dashboard_columns : 4,
			dashboard_row_height : 100,
		};
		
	}
	
	propTypes: {
		draggable_handle : React.PropTypes.string,
	}
	
	static defaultProps = {
		draggable_handle : ".widget_draggabble_area"		
	}
	
	
	/**
	 * Searches the dashboard for an element with the given key, removing it if found.
	 */
	closeWidget(key){
		
		let updated_rendered_widgets = [];
		
		// Track only widgets that haven't been dismissed
		for (let widget of this.state.rendered_widgets) {
			if(widget.key !== key){
				updated_rendered_widgets.push(widget);
			}
		}
		
		// If there actually was a widget that was dismissed, update the state
		if(this.state.rendered_widgets.length !== updated_rendered_widgets){
			this.setState({rendered_widgets : updated_rendered_widgets})
		}
		
	}
	
	/**
	 * Renders all of the widgets from the application configuration into the dashboard
	 */
	renderWidgets(){
				
		let currentRouteName = this.props.route_name;		
		var renderedWidgets = [];
		
		// Finds config info for the current dashboard
		let currentDashboard = function(){
			for (let dashboard of window.app_config.dashboards) {
				if(dashboard.route_name === currentRouteName){
					return dashboard
				}
			};		
		}();
		
		
		// Finds config info for a given widget
		function findWidgetConfiguration(widgetName) {
			for (let widget of window.app_config.dashboard_widgets) {
				if(widget.widget_class_name === widgetName){
					return widget
				}
			};		
		}
			
		// Use dashboard settings, if provided
		let rowHeight = (typeof currentDashboard.row_height !== "undefined" ? currentDashboard.rowHeight : this.state.dashboard_row_height);
		let numColumns = (typeof currentDashboard.number_of_columns !== "undefined" ? currentDashboard.number_of_columns : this.state.dashboard_columns);
		
		this.setState({
			dashboard_columns : numColumns,
			dashboard_row_height : rowHeight,
		})
		
		// TODO: Write routine for dynamically generating layout
		if(currentDashboard.auto_position){
			
			// TODO
			
		} else {
			
			// Iterate every widget and load it
			for (let widget of currentDashboard.supported_widgets) {	
			
				let widgetConfiguration = findWidgetConfiguration(widget.name);

				let x = widget.layout.x;
				let y = widget.layout.y;
				let w = (typeof widget.layout.w === 'undefined' ? widgetConfiguration.min_grid_size.w : widget.layout.w);
				let h = (typeof widget.layout.h === 'undefined' ? widgetConfiguration.min_grid_size.h : widget.layout.h);

				// Dynamically load Widget module
				require.ensure([], () => {  
				
					// Widgets live up one directory from Dashbaord.js in /Dashboard/Widgets/
					// TODO: look into absolute reference in ES6/Babel
					let Widget = require("../" + widgetConfiguration.widget_url);
					
					let containerKey = uniqueId();
					
					let widgetComponent = <Widget.default key={uniqueId()} route={this.props.route} route_params={this.props.routeParams} close_button_clickhandler={() => { this.closeWidget(containerKey)}} />;
					
					// Widget must be wrapped in a div with specs due to the way react-grid-layout is written
					let wrappedWidgetComponent = <div key={containerKey} data-grid={{x: x, y: y, w: w, h: h}} children={widgetComponent}/>
						
					// React likes immutable datastructues in state, so rebuild it each time. 
					// Look into immtuability-helper if this becomes unperformant.
					// Reference: http://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs/41445812#41445812
					renderedWidgets = [ ...renderedWidgets, wrappedWidgetComponent ]; // --> [1,2,3,4]

					this.setState({rendered_widgets : renderedWidgets})
					
				}); 
			
			}			
		}

	}
	
	
	/**
	 * On initial page load, render the dashboard
	 */
	componentDidMount(){
		this.renderWidgets()
	}
	
	
	/**
	 * Only trigger an update if the route has calling the dashboard has changed
	 * and there were new widgetw added to the state
	 */
	shouldComponentUpdate(nextProps, nextState){
		// Determine if the rendered widgets actually changed
		var equal = true;
		if(this.state.rendered_widgets.length === nextState.rendered_widgets.length){

			for(var i=0; i< this.state.rendered_widgets.length; i++){
				
				// Widget keys should be the same unless the entire dashboard has been updated
				if(this.state.rendered_widgets[i].key !== nextState.rendered_widgets[i].key){
					equal = false;
				}
			}
		} else {
			equal = false;
		}
			
		
		if(this.props.route_name === nextProps.route_name && this.props.location.pathname === nextProps.location.pathname){
			
			if(equal){
				return false;
			} else {
				return true;
			}
			
		} else {		
			return true;
		}
		
	}
	

	/**
	 * Clears dashboard if a new route was requested
	 */
	componentDidUpdate(prevProps, prevState){
				
		if(this.props.route_name !== prevProps.route_name && this.props.location.pathname !== prevProps.location.pathname){
			// Clear state before re-rendering widgets
			this.setState({rendered_widgets: []}, () => { this.renderWidgets(); });
		}

	}

	
	render() {
		return (
		  <div>
			
			<AutoWidthReactGridLayout  measureBeforeMount={true} className="layout" cols={this.state.dashboard_columns} rowHeight={this.state.dashboard_row_height} draggableHandle={this.props.draggable_handle}>
				{this.state.rendered_widgets}
			</AutoWidthReactGridLayout >
					
		  </div>
		);
  }
}

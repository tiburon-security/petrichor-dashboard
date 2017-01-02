import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

/**
 * this is very very broken still. working to figure out how i can use react-grid-layout, but have the individual widgets from seperate files
 * generate their own elements
 */


// Brings all widgets used into namespace for referencing by their string name
//import * as dashboardWidgets from './Dashboard/DashboardWidgets.js';
import $ from 'jquery';
//import 'lodash';

//import gridstack from 'gridstack';

//import {Responsive, WidthProvider, ReactGridLayout} from 'react-grid-layout';
//var ReactGridLayout = require('react-grid-layout');

//const ResponsiveReactGridLayout = WidthProvider(Responsive);

import ReactGridLayout, {GridItem, WidthProvider} from 'react-grid-layout';

/*
var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);*/

export class Dashboard extends Component {
	
	constructor(props){
		
		super(props);
		
		/*
				this.gridstack_options = {
			cellHeight: 80,
			verticalMargin: 10
		};
		*/
		
		this.state = {
			rendered_widgets: [],
		};
		

		
	}
	
	componentDidMount(){
		let currentRouteName = this.props.route.name;
		let allWidgets = window.app_config.dashboard_widgets;
		
		let widgetsToRender = [];
		let renderedWidgets = []
		
		// Iteate every widget
		for (let [widgetIndex, widget] of allWidgets.entries()) {
			
			console.info(widget.widget_class_name);
			
			// Look at every route supported by the widget
			for(var supportedWidget of widget.supported_route_names){
				
				// Track the widget if supported by curreny route
				if(supportedWidget === currentRouteName){
					
					console.log("widget url: " + widget.widget_url);
					
					// Dynamically load Widget module
					require.ensure([], () => {  
						let Widget = require(widget.widget_url);
							console.log(Widget)
							// Update the state with the rendered Widget
							this.state.rendered_widgets.push(<Widget.default key={widgetIndex}/>);
						
							this.setState(
								{
									rendered_widgets : this.state.rendered_widgets
								}
							);
					}); 
					
					widgetsToRender.push(widget.widget_class_name);
					break;
				}
							
			}
			
		}
		
		console.log("widgets to render");
		console.log(widgetsToRender);

		
	}
	

	
	render() {
	  
		
	  
		return (
		  <div>
			
			  dashboard  component dude currentLocation
			  <div id='grid-stack' className='grid-stack'>
			  


{this.state.rendered_widgets}
			
			<ReactGridLayout  className="layout" cols={12} rowHeight={30} width={1200}>
				
        
			</ReactGridLayout >
	  
	  {/* {this.state.rendered_widgets} */}

			  
			  </div>
			
			
			
		  </div>
		);
  }
}

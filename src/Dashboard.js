import React, { Component } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {uniqueId } from 'lodash';
import FakeWidget from './Dashboard/Widgets/FakeWidget.js';


/**
 * this is very very broken still. working to figure out how i can use react-grid-layout, but have the individual widgets from seperate files
 * generate their own elements
 */



//import ReactGridLayout, {GridItem, WidthProvider} from 'react-grid-layout';


export class Dashboard extends Component {
	
	constructor(props){
		
		super(props);
		
		this.state = {
			rendered_widgets : [],
		};
		
	}
	
	
	renderWidgets(){
		let currentRouteName = this.props.route.name;
		let allWidgets = window.app_config.dashboard_widgets;
		console.log("dashboard route: ");console.log(this.props.route);
		let renderedWidgets = []
		
				
		// Iteate every widget
		for (let [widgetIndex, widget] of allWidgets.entries()) {
						
			// Look at every route supported by the widget
			for(var supportedWidget of widget.supported_route_names){
				
				// Track the widget if supported by curreny route
				if(supportedWidget === currentRouteName){
										

					// Dynamically load Widget module
					require.ensure([], () => {  
						let Widget = require(widget.widget_url);
							
							let widgetComponent = <Widget.default key={uniqueId()}/>;

							// Update the state with the rendered Widget
							renderedWidgets.push(widgetComponent);
							
							this.setState(
								{
									rendered_widgets : renderedWidgets
								}
							)
						
					}); 
					
					break;
				}
							
			}
			
		}
		
	}
	

	componentDidMount(){
		console.log("comp did mount...");
		this.renderWidgets()
	}
	
	
	/**
	 * Only trigger an update if the route has calling the dashboard has changed
	 * and there were new widgetw added to the state
	 */
	shouldComponentUpdate(nextProps, nextState){
		console.log("should component update?");
		
		// Determine if the rendered widgets actually changed
		var equal = true;
		if(this.state.rendered_widgets.length == nextState.rendered_widgets.length){
			for(var i=0; i< this.state.rendered_widgets.length; i++){
				
				// Widget keys should be the same unless the entire dashboard has been updated
				if(this.state.rendered_widgets[i].key != nextState.rendered_widgets[i].key){
					equal = false;
				}
			}
		} 
			
		
		if(this.props.route.name === nextProps.route.name && this.props.route.path === nextProps.route.path&& !equal){
			console.log("not it shouldnt");
			return false;
		} else {
			console.log("yes it should");
			return true;
		}
	}

	
	componentDidUpdate(){
		this.renderWidgets();
	}

	
	render() {
	  
		console.log("rendering, this is the current state: ");
		console.log(this.state.rendered_widgets);
		
		return (
		  <div>
			
			  dashboard  component dude currentLocation
			  <p>{this.state.fake_state}</p>
			  <div id='grid-stack' className='grid-stack'>

				{this.state.rendered_widgets}
			
				{/*<ReactGridLayout  className="layout" cols={12} rowHeight={30} width={1200}>
        
				</ReactGridLayout >*/}
			  
			  </div>
			
			
			
		  </div>
		);
  }
}

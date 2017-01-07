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

		var renderedWidgets = []
		
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
							
						// React likes immutable datastructues in state, so rebuild it each time. 
						// Look into immtuability-helper if this becomes unperformant.
						// Reference: http://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs/41445812#41445812
						renderedWidgets = [ ...renderedWidgets, widgetComponent ]; // --> [1,2,3,4]

						this.setState({rendered_widgets : renderedWidgets})
						
					}); 
					
					break;
				}			
			}
		}
	}
	

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
				if(this.state.rendered_widgets[i].key != nextState.rendered_widgets[i].key){
					equal = false;
				}
			}
		} else {
			equal = false;
		}
			
		
		if(this.props.route.name === nextProps.route.name && this.props.route.path === nextProps.route.path){
			
			if(equal){
				return false;
			} else {
				return true;
			}
			
		} else {		
			return true;
		}
		
	}

	
	componentDidUpdate(prevProps, prevState){
				
		if(this.props.route.name !== prevProps.route.name && this.props.route.path !== prevProps.route.path){
			// Clear state before re-rendering widgets
			this.setState({rendered_widgets: []}, () => { this.renderWidgets(); });
		}

	}

	
	render() {

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

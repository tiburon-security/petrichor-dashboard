import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import $ from 'jquery';
import Gentella from './GentellaThemeComponents/Gentella.js';

// Brings all components used in dynamic routes into namespace
// for referencing by their string name
import * as routableComponents from './RoutableComponents.js';


$.get("/routes_menu_config.json", bootstrapApplication);

function bootstrapApplication(config){
	
	// Store the config as a global,  since it will be reference in othermaybe
	// parts of the app, maybe there's a better way of doing this...?
	window.app_config = config;
	
	var dynamicRoutesJSX = buildDynamicRoutes(config);

	// Render overall look and theme for gentella
	ReactDOM.render(<Gentella/>, document.getElementById('root'));

	// Hook the content body of gentella, this is where page content
	// will be rendered. Routes control this body content
	ReactDOM.render((
		<Router history={browserHistory}>
			{dynamicRoutesJSX}
		</Router>
	     
	), document.getElementById('gentella_content_body'));

}
	


function buildDynamicRoutes(config){

	var routeJSX = [];
	
	// Iterate all routes and add them to React Router
	for(var i=0; i < config.routes.length; i++){
		
		var route = config.routes[i];

		routeJSX.push(<Route path={route.path} test='dookie' name={route.route_name} components={routableComponents[route.component]} key={i}/>); 		

		// If a child route exists, add it
		if(route.child_routes != null){
			
			// Add all child routes
			for(var j=0; j < route.child_routes.length; j++){
				
				var childRoute = route.child_routes[j];
				var fullPath = route.path + childRoute.path;
				
				routeJSX.push(<Route path={fullPath} name={childRoute.route_name} components={routableComponents[childRoute.component]} key={i}/>); 		
				
			}
			
		}
	
	}
	

	return routeJSX;

}


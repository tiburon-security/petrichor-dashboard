import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Gentella from './Theme/Gentella.js';
import AddPropsToRoute from './Helpers/AddPropsToRoute.js';
import {App} from './Views/SampleReact.js';
import { Provider } from 'react-redux';
import configureStore from './redux/store/configureStore';

// Brings all components used in dynamic routes into namespace
// for referencing by their string name
import * as routableViews from './RoutableViews.js';

fetch('/routes_menu_config.json')
	.then(function(response) {
		return response.json()
	})
	.then(bootstrapApplication)
	

function bootstrapApplication(config){
	
	const store = configureStore();

	// Store the config as a global,  since it will be reference in othermaybe
	// parts of the app, maybe there's a better way of doing this...?
	window.app_config = config;
	
	var dynamicRoutesJSX = buildDynamicRoutes(config, store);
	
	// Hook the content body of gentella, this is where page content
	// will be rendered. Routes control this body content
	ReactDOM.render((
		<BrowserRouter store={store}>
		
			<Switch>
				{dynamicRoutesJSX}
			</Switch>
		
		</BrowserRouter>
	     
	), document.getElementById('root'));

}



function buildDynamicRoutes(config, store){

	var routeJSX = [];
	
	var uniqueKey = 0;
	

	
	// Add the index route
	routeJSX.push(
		<Route 
			exact 
			path="/" 
			key={uniqueKey}
			render={(props)=>(
				<Provider store={store}>
					<Gentella config={config} {...props}>
						{/*routableViews[config.index_route.component]*/}
						<App/>
					</Gentella>
				</Provider>
			)}			
		/>
	)
	
	uniqueKey++;
	
	// Iterate all routes and add them to React Router
	for(var i=0; i < config.routes.length; i++){
		
		var route = config.routes[i];
		
		routeJSX.push(
			<Route 
				path={route.route} 
				key={uniqueKey} 
				render={(props)=>(
					<Provider store={store}>
						<Gentella config={config} {...props} >
							{/*routableViews[route.component]*/}
						</Gentella>
					</Provider>
				)}
			/>
		);
		
		uniqueKey++;

		// If a child route exists, add it
		if(route.child_routes != null){
			
			// Add all child routes
			for(var j=0; j < route.child_routes.length; j++){
				
				var childRoute = route.child_routes[j];
				var fullPath = route.route + childRoute.route;
				
				routeJSX.push(
					<Route 
						path={fullPath}  
						key={uniqueKey}
						render={(props)=>(
							<Provider store={store}>
								<Gentella config={config} {...props} >
									{routableViews[route.component]}
								</Gentella>
							</Provider>
						)}
					/>
				); 	

				uniqueKey++;				
				
			}
			
		}
		
		
	
	}

	//let final = <Route path="/" name={config.index_route.route_name} children={routeJSX} component={AddPropsToRoute(Gentella, {'config': config, 'name' : config.index_route.route_name})} />
	//let final = <Route path="/" name={config.index_route.route_name} children={routeJSX} component={AddPropsToRoute(Gentella, {'config': config})} />
	console.log(routeJSX)
	
	//let final = <div>{routeJSX}</div>
let final = routeJSX
	return final;
	
}


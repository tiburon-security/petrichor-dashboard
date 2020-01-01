// Polyfills for legacy browsers
import "core-js/stable";

import React from 'react';
import ReactDOM from 'react-dom';
import Gentella from './Theme/Gentella.js';
import { Provider } from 'react-redux';
import store from './redux/store/configureStore';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { init } from './Helpers/FontAwesomeInit';

fetch('/routes_menu_config.json')
	.then(function(response) {
		return response.json()
	})
	.then(function(mainJson){		
		fetch(mainJson.user_api_endpoint)
		.then(function(userResponse){			
			return userResponse.json()
		})
		.then(function(userJson){
			bootstrapApplication(mainJson, userJson)
		})
		
	})

	
function bootstrapApplication(config, userConfig){
	
	// Initialize font-awesome icons
	init()

	// Store the config as a global,  since it will be reference in othermaybe
	// parts of the app, maybe there's a better way of doing this...?
	window.app_config = config;
		
	// Hook the content body of gentella, this is where page content
	// will be rendered. Routes control this body content
	ReactDOM.render((
	<React.StrictMode>
	<Provider store={store}>
		<BrowserRouter>
		
			{/*
			Pathless route to ensure child components are re-rendered on location changes when using React-Redux
			https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
			*/}
			<Route 
				render={(props)=>(
					<Gentella config={config} userConfig={userConfig} location={props.location} />
				)}
			/>
		</BrowserRouter>
	</Provider>
	</React.StrictMode>
	     
	), document.getElementById('root'));

}

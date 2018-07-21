// Polyfills for legacy browsers
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Gentella from './Theme/Gentella.js';
import { Provider } from 'react-redux';
import store from './redux/store/configureStore';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

fetch('/routes_menu_config.json')
	.then(function(response) {
		return response.json()
	})
	.then(function(mainJson){		
		fetch('/sample_user_api.json')
		.then(function(userResponse){			
			return userResponse.json()
		})
		.then(function(userJson){
			bootstrapApplication(mainJson, userJson.data)
		})
		
	})

	
function bootstrapApplication(config, userConfig){

	// Store the config as a global,  since it will be reference in othermaybe
	// parts of the app, maybe there's a better way of doing this...?
	window.app_config = config;
		
	// Hook the content body of gentella, this is where page content
	// will be rendered. Routes control this body content
	ReactDOM.render((
	<Provider store={store}>
		<BrowserRouter>
		
			{/*
			Pathless route to ensure child components are re-rendered on location changes when using React-Redux
			https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
			*/}
			<Route 
				render={(props)=>(
					<Gentella config={config} {...userConfig} location={props.location} />
				)}
			/>
		</BrowserRouter>
		</Provider>
	     
	), document.getElementById('root'));

}

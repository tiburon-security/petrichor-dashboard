import React from 'react';
import ReactDOM from 'react-dom';
import Gentella from './Theme/Gentella.js';
import { Provider } from 'react-redux';
import store, { history } from './redux/store/configureStore';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router';

fetch('/routes_menu_config.json')
	.then(function(response) {
		return response.json()
	})
	.then(bootstrapApplication)
	

function bootstrapApplication(config){
	
	// Store the config as a global,  since it will be reference in othermaybe
	// parts of the app, maybe there's a better way of doing this...?
	window.app_config = config;
		
	// Hook the content body of gentella, this is where page content
	// will be rendered. Routes control this body content
	ReactDOM.render((
	<Provider store={store}>
		<ConnectedRouter history={history}>
		
			{/*
			Pathless route to ensure child components are re-rendered on location changes when using React-Redux
			https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
			*/}
			<Route 
				render={(props)=>(
					<Gentella config={config} location={props.location} />
				)}
			/>
		</ConnectedRouter>
		</Provider>
	     
	), document.getElementById('root'));

}

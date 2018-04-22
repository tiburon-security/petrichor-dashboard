import React from 'react';
import ReactDOM from 'react-dom';
import Gentella from './Theme/Gentella.js';
import { Provider } from 'react-redux';
import store, { history } from './redux/store/configureStore';
import { ConnectedRouter } from 'react-router-redux'

fetch('/routes_menu_config.json')
	.then(function(response) {
		return response.json()
	})
	.then(bootstrapApplication)
	

function bootstrapApplication(config){
	
	// Store the config as a global,  since it will be reference in othermaybe
	// parts of the app, maybe there's a better way of doing this...?
	window.app_config = config;
	
	//var dynamicRoutesJSX = buildDynamicRoutes(config, store);
	
	// Hook the content body of gentella, this is where page content
	// will be rendered. Routes control this body content
	ReactDOM.render((
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Gentella config={config} />
		
		{/*<Switch>
				{dynamicRoutesJSX}
		</Switch>*/}
		
		</ConnectedRouter>
		</Provider>
	     
	), document.getElementById('root'));

}

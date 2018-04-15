import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Gentella from './Theme/Gentella.js';
import PropsRoute from './Helpers/PropsRoute.js';
import {App} from './Views/SampleReact.js';
import { Provider } from 'react-redux';
import store, { history } from './redux/store/configureStore';
import { ConnectedRouter, push } from 'react-router-redux'
import { uniqueKey } from 'lodash'

// Brings all components used in dynamic routes into namespace
// for referencing by their string name
import * as routableViews from './RoutableViews.js';

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

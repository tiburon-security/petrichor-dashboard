(function(){

	var app = angular.module('dashboardApp',['ngRoute', 'ngAnimate', 'ui.bootstrap', 'dashboardApp.widgetDashboard']);

    // Grab dashboard config, load angular app
    fetchData().then(bootstrapApplication);


    /**
     * Method for grabbing the dashboard configuration prior to the angular application
     * being loaded.
     */
    function fetchData() {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");

        return $http.get("app/routes_menu_config.json").then(function(response) {
            app.constant("routes_menu_config", response.data);
        }, function(errorResponse) {
            // Handle error case
        });
    }


    /**
     * Generic angular application configuration
     */
	app.constant('CONFIG', {
	    'APP_NAME' : 'My Awesome App',
	    'APP_VERSION' : '0.0.0',
	    'GOOGLE_ANALYTICS_ID' : '',
	    'BASE_URL' : '',
	    'SYSTEM_LANGUAGE' : ''
	});


    /**
     * Enables the angular application
     */
	function bootstrapApplication() {
	    buildRoutes();
	    angular.bootstrap(document, ["dashboardApp"]);
	}

	
	/**
	 * Method for building the application's routes at run time based on the routes_menu_config.json 
	 */
	function buildRoutes(){
		
		// Grab the JSON extracted from the config file
		var routesAndMenuConfig = angular.injector(['dashboardApp']).get('routes_menu_config');
	    
	    var routes = routesAndMenuConfig["routes"];	

		// Configure angular routes based on JSON
		app.config(['$routeProvider', '$locationProvider',
	    	function($routeProvider, $locationProvider) {

	        	for(var i=0; i < routes.length; i++){
	        		
	        		var currentRoute = routes[i];

					// If the current node actually has a route, add it
	        		if(currentRoute.route){
		        		$routeProvider.
		                    when(currentRoute.route, {
			                    templateUrl: currentRoute.template,
			                    controller: currentRoute.controller,
			                    routeName: currentRoute.route_name
		                });
	               }
	               
	               // If the current node actually has child routes, add them
	               if(currentRoute.child_routes){
	               		for(var j=0; j < currentRoute.child_routes.length; j++){
	               			var currentChildRoute = currentRoute.child_routes[j];

	               			$routeProvider.
			                    when(currentRoute.route + "" + currentChildRoute.route, {
				                    templateUrl: currentChildRoute.template,
				                    controller: currentChildRoute.controller,
			                        routeName: currentChildRoute.route_name
		              	  });
	               		}
	               }
	                
	        	}


	    }]);
	    
	}
	
	

    

    /**
     * Controller for the Homepage 
     */
	app.controller('HomepageController', ['$scope', 'CONFIG', 'routes_menu_config', function($scope) {
	     
	    $scope.message = 'This is Add new order screen';
	     
	}]);


    /**
     * Controller for the navigation menu
     */
	app.controller('MenuController', ['$scope', 'CONFIG', 'routes_menu_config', function($scope, config, routesConfig) {
		
		$scope.menu = routesConfig.routes;
	
	}]);
	

    /**
     * Define new module for common services
     */
	var servicesModule = angular.module('dashboardApp.services', []);
    

    /**
     * Define new module for dashboard widgets
     */
	var widgetDashboardApp = angular.module('dashboardApp.widgetDashboard', ['dashboardApp.services', ]);
	
	// Take a copy of CompileProvder so we can dynamically compile directives
	widgetDashboardApp.config(['$compileProvider', function($compileProvider){
		widgetDashboardApp.compileProvider = $compileProvider;
	}]);
	
	
	widgetDashboardApp.controller('DashboardAppController', ['$rootScope', '$scope', '$route', '$compile', '$document', 'CONFIG', 'routes_menu_config', 'lazyScriptLoader', 'lazyDirectiveLoader', 'widgetRegistration', function($rootScope, $scope, $route, $compile, $document, config, routesMenuConfig, lazyScriptLoader, lazyDirectiveLoader, widgetRegistration) {
        
        var selectedRouteName = $route.current.$$route.routeName;
        
        // Iterate all widgets
        for(var i=0; i < routesMenuConfig.dashboard_widgets.length; i++){
        
            // current widget being iterated
            var currentWidget = routesMenuConfig.dashboard_widgets[i];
       
            // Grab widgets which support current dashboared type
            for(var j=0; j < currentWidget.supported_route_names.length; j++){

                // Lazy load and register widget
                if(currentWidget.supported_route_names[j] == selectedRouteName){
                    
                    // current widget being iterated that is supported by the dashboard type
                    var supportedWidget = currentWidget.supported_route_names[j];

                    // Load the directive, add to DOM
                    lazyDirectiveLoader.load(currentWidget.widget_name, currentWidget.widget_url).then(function(compiledDirective){
                        angular.element(document.getElementById("page-content")).append(compiledDirective);
                    });
                }
            }
        
        }
        

        
    }]);
    
}());

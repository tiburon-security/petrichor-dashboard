var dashboardModule = angular.module('dashboardApp.widgetDashboard');

dashboardModule.service('widgetRegistration', [function () {

    this.registeredWidgets = [];

    this.registerWidget = function(widget) {
       this.registeredWidgets.push(widget);
    };
    
    this.getRegisteredWidgets = function(){
        return this.registeredWidgets;
    };

    this.clear = function(){
        this.registeredWidgets = [];
    };

}]);

/*

dashboardModule.service('widgetRegistration', ['$rootScope', '$q', '$compile', function($rootScope, $q, $compile) {

    // Track the scripts that have already been lazy loaded 
    // so that it isn't loaded twice
    var lazyLoadedScripts = [];
 
    var _load = function(scriptLocation) {


    };
 
    return {
        load: _load
    };
 
}]);*/

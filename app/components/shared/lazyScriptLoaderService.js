/**
 * Service for lazy loading javascript files, returning a promise upon loading
 */


angular.module('dashboardApp.services')
    .service('lazyScriptLoader', ['$rootScope', '$q', '$compile', function($rootScope, $q, $compile) {

        // Track the scripts that have already been lazy loaded 
        // so that it isn't loaded twice
        var lazyLoadedScripts = [];
     
        var _load = function(scriptLocation) {

            // check if script already lazy loaded
            if(lazyLoadedScripts.indexOf(scriptLocation) <= -1){
            
                var deferred = $q.defer();
                        
                lazyLoadedScripts.push(scriptLocation);
         
                // download the javascript file, append to <head>
                var script = document.createElement('script');
                script.src = scriptLocation;
                script.onload = function() {
                    $rootScope.$apply(deferred.resolve);
                };
                document.getElementsByTagName('head')[0].appendChild(script);
         
                return deferred.promise;
                
            } else {
                // Return empty promise, script already loaded before
                return $q.resolve();
            }
        };
        

        return {
            load: _load
        };
     
    }]);

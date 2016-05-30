/**
 * Service for lazy loading directives and compiling their associated HTML, returning a promise of compiled html
 *
 * inspired by: http://www.codeproject.com/Articles/838402/Lazy-loading-directives-in-AngularJS-the-easy-way
 */


angular.module('dashboardApp.services')
    .service('lazyDirectiveLoader', ['$rootScope', '$q', '$compile', 'lazyScriptLoader', function($rootScope, $q, $compile, lazyScriptLoader) {

        /**
         * Loads javascript and compiles associated directive
         * @return promise of compiled HTML
         */
        var _loadDirective = function(directiveName, directiveLocation, attrsMap) {
        
            var deferred = $q.defer();
            
            // Add the javascript to the app
            lazyScriptLoader.load(directiveLocation).then(function(){

                // Convert directive name to snake case & format as element, compile
                var elementName = _snakeCase(directiveName);
                var element = '<' + elementName + '></' + elementName + '>';
                var compiledElement = $compile(element)($rootScope);

                deferred.resolve(compiledElement);
            
            })
            
            return deferred.promise;
        };


        /**
         * Just a copy of Angular's built in function, can't figure out how
         * to expose it to a service
         * https://github.com/angular/angular.js/blob/master/src/Angular.js
         */
        var _snakeCase = function(name, separator) {
            var SNAKE_CASE_REGEXP = /[A-Z]/g;

            separator = separator || '_';
            return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
                return (pos ? separator : '') + letter.toLowerCase();
            });
        };
        

        return {
            load: _loadDirective
        };
     
    }]);

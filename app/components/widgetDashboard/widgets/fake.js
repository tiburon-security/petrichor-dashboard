// http://blog.brunoscopelliti.com/how-to-defer-route-definition-in-an-angularjs-web-app/
(function () {

    var directive = function () {
		
        return {
			//restrict: 'E',
			//templateUrl: 'app/components/menu/menuView.html',
			//controller: 'MenuController',
			template: "<button class='sexy'>sexy button</button>",
			link: function ($scope, element, attrs) {
				

				console.log("im in the fake widget directive");

			}
			
		};
		
	};

    angular.module('dashboardApp.widgetDashboard')
        .compileProvider
        .directive('fakeWidget', [directive]);

}());

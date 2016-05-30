// http://blog.brunoscopelliti.com/how-to-defer-route-definition-in-an-angularjs-web-app/
(function () {

    var directive = function () {
		
        return {
			//restrict: 'E',
			templateUrl: 'app/components/menu/menuView.html',
			controller: 'MenuController',
			link: function ($scope, element, attrs) {
				
				/// Only allow one menu item to be open at a time
				$scope.oneAtATime = true;

				$scope.addMenuItem = function(){
					console.log("added menu item");	
				};

				//$scope.addMenuItem();
				//$scope.parentId = attr.id;
				
				/*
				$scope.dude = function(){
					console.error("dude");	
				};
				
				console.log("menu directive called");
				
				// FIgure out how to make this fire once the ng-repeats in the template are done...
				$scope.enableAnimations = function() {
					console.log("animate!");
					$('#sidebar-menu li ul').slideUp();
					$('#sidebar-menu li').removeClass('active');

					$('#sidebar-menu li').on('click touchstart', function() {
						var link = $('a', this).attr('href');

						if(link) { 
							window.location.href = link;
						} else {
							if ($(this).is('.active')) {
								$(this).removeClass('active');
								$('ul', this).slideUp();
							} else {
								$('#sidebar-menu li').removeClass('active');
								$('#sidebar-menu li ul').slideUp();
								
								$(this).addClass('active');
								$('ul', this).slideDown();
							}
						}
					});

					$('#menu_toggle').click(function () {
						if ($('body').hasClass('nav-md')) {
							$('body').removeClass('nav-md').addClass('nav-sm');
							$('.left_col').removeClass('scroll-view').removeAttr('style');
							$('.sidebar-footer').hide();

							if ($('#sidebar-menu li').hasClass('active')) {
								$('#sidebar-menu li.active').addClass('active-sm').removeClass('active');
							}
						} else {
							$('body').removeClass('nav-sm').addClass('nav-md');
							$('.sidebar-footer').show();

							if ($('#sidebar-menu li').hasClass('active-sm')) {
								$('#sidebar-menu li.active-sm').addClass('active').removeClass('active-sm');
							}
						}
					});
					
					var url = window.location;
					$('#sidebar-menu a[href="' + url + '"]').parent('li').addClass('current-page');
					$('#sidebar-menu a').filter(function () {
						return this.href == url;
					}).parent('li').addClass('current-page').parent('ul').slideDown().parent().addClass('active');
				}();
				*/
				

			}
			
		};
		
	};

    angular.module('dashboardApp')
        .directive('menuDirective', [directive]);

}());

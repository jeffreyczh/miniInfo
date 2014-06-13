/**
 * 
 */
var miniInfoApp = angular.module("miniInfoApp", []);

miniInfoApp.controller('miniInfoCtrl', ['$scope', function($scope) {
	/* load data from the file */
	
	// check if the file exists. If yes, ask for password and load the data from the file
	$scope.contacts = [];
	$scope.keys = [];
	
	initDialogs($scope);
	       	
	       	// add an entry
	       	$scope.add = function() {
	       		var index =   getSelectedTabIndex( "#view-tabs" ) ;
	       		switch (index) {
	       		case 0:
	       			var inputs = $("#tab-contact input");
	       			$scope.contacts.push({'name': $(inputs.get(0)).val(), 'addr': $(inputs.get(1)).val()});
	       			break;
	       		case 1:
	       			var inputs = $("#tab-keys input");
	       			$scope.keys.push({'name': $(inputs.get(0)).val(), 'userName': $(inputs.get(1)).val(), 'password': $(inputs.get(2)).val()});
	       			break;
	       		default:
	       			break;
	       		}
	       		// empty fields after adding
	       		for (var i = 0, max = inputs.length; i < max; i++) {
	       			$(inputs.get(i)).val("");
	       		}
	       		// save the change
	       		save({contacts: $scope.contacts, keys: $scope.keys});
	       	};
	       	
	       	// highlight a table row when the mouse moves over it
	       	$scope.highlight = function($event) {
	       		$.each($("td"), function(index, td) {
	       			if ($(td).hasClass("highlight")) {
	       				$(td).removeClass("highlight");
	       			}
	       		});
	       		$($event.target).parent().find("td").addClass("highlight");
	        };
	        
	        // initialize the context menu
	        initMenus($scope);
	        // pop up the context menu
	        $scope.popupMenu = function($event) {
	        	var tag = $event.target.tagName.toLowerCase();
	        	if ( tag=== "td") {
	        		if ( !getSelectedText() ) {
		        		menu.items[0].enabled = false;
		        	} else {
		        		menu.items[0].enabled = true;
		        	}
		        	menu.popup($event.X, $event.Y);
	        	} else if (tag === "input") {
	        		menu_input.popup($event.X, $event.Y);
	        	} else {}
	        };
	        
}]).directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
    	var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
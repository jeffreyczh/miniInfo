/**
 * Startup page, typically for setting up jQuery UI
 */

$(function() {
	$(document).on("mouseup", getSelectedText);
	
    $( "#view-tabs" ).tabs({ show: "slide" ,
    	activate: function(event, ui){
    		// empty fields each time the tab is activated
    		var inputs = ui.newPanel.find("input");
    		for (var i = 0, max = inputs.length; i < max; i++) {
    			$(inputs.get(i)).val("");
    		}
    	}
    	});
  }
);

/**
 * Gets the index of the selected tab in the tabs
 * @param selector String. The selector of the tabs
 * @returns index of the selected tab
 */
function getSelectedTabIndex(selector) {
	return $(selector).tabs("option", "active");
}

/**
 * Gets the index of the selected table row
 * @returns the index of the selected row
 */
function getSelectedRowIndex() {
	var tds = $("td");
	for (var i = 0, max = tds.length; i < max; i++) {
		var td = tds.get(i);
		if ($(td).hasClass("highlight")) {
			return $(td).parent().index();
		}
	}
}

/**
 * Gets the selected text
 * @returns the selected text
 */
function getSelectedText() {
	return window.getSelection().toString();
}
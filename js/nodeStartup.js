/*
  * Setting up behaviors related to Node.js 
  */

var gui = require('nw.gui');
var fs = require('fs');
var path = require("path");
var crypto_node = require("crypto");
var menu = new gui.Menu();
var menu_input = new gui.Menu(); // the context menu for those input tags
var clipboard = gui.Clipboard.get();

var dataPath = path.join(process.execPath, "../data");
var pwd = ""; // the password for encrypting/decrypting data


$(function() {
	// pop up the dialog to ask for password
	if ( fs.existsSync(dataPath) ) {
		// the data file exists. Ask for password to decrypt
		$("#pwdDialog").dialog("open");
	} else {
		// request for creating a password for future encryption
		$("#firstDialog").dialog("open");
	}
});

/**
 * encrypt an JSON object and save it to the file
 * @param obj JSON object
 * @param pwd provided password
 */
function save(obj) {
	var plainContent = angular.toJson(obj);
	fs.writeFileSync( path.join(process.execPath, "../data"), 
														encryptContent(plainContent) );
}

/**
 * Loads and decrypts the information from the data file
 * Assuming the data file exists
 * @param pwd the provided password
 * @returns the JSON object; false if the password is wrong
 */
function loadContent(dataPath, password) {
	var encryptedContent = fs.readFileSync(dataPath, "utf8");
	try {
		return angular.fromJson( decryptContent(encryptedContent, password) );
	} catch(err) {
	}
	// mostly, the provided password is wrong
	return false;
}

/**
 * Initializes the dialogs
 * @param $scope the $scope object used in the AnguarJS controller, holding the data
 */
function initDialogs($scope) {
	
	function pwdDialogOK() {
		pwd = $("#pwdDialog input").get(0).value;
		var obj = loadContent( dataPath, pwd);
		if (obj === false) {
			   // the provided password is wrong
			   $("#pwdDialog .warning").html("Incorrect Password");
			   $("#pwdDialog input").get(0).value = "";
		} else {
			   $scope.$apply(function() {
				   $scope.contacts = obj.contacts;
				   $scope.keys = obj.keys;
			   });	   
			   $("#pwdDialog").dialog("close");
		}
	}
	$("#pwdDialog").dialog({
		autoOpen: false,
		modal: true,
		dialogClass: "no-close",
		show: { effect: "scale",
						duration: 290},
		buttons: {
			"OK":
			pwdDialogOK
		}
	});
	
	$("#pwdDialog input").keypress(function(e) {
	    if(e.which == 13) {
	    	pwdDialogOK();
	    }
	});
	
	$("#firstDialog").dialog({
		autoOpen: false,
		modal: true,
		dialogClass: "no-close",
		show: { effect: "scale",
						duration: 290},
		buttons: {
			"OK":
			function() {
			   var inputs = $(this).find("input");		 
			   if ( inputs.get(0).value === inputs.get(1).value ) {
				   pwd = inputs.get(0).value;
				   $(this).dialog("close");
			   } else {
				   $(this).find(".warning").html("Passwords do not match");
			   }
			}
		}
	});
	
	// initialize the Edit dialog
    $("#editDialog").dialog({
    		autoOpen: false,
    		modal: true,
    		show: { effect: "scale",
    						duration: 150},
    		buttons: {
    			"Save":
    			function() {
    			   var rowIndex = getSelectedRowIndex();
    			   var inputs = $("#editDialog input");
    		       switch (inputs.length) {
    		       		case 2:
    		       			$scope.$apply(function() {
    		       				$scope.contacts[rowIndex].name = inputs.get(0).value;
    		       				$scope.contacts[rowIndex].addr = inputs.get(1).value;
    		       			});
    		       			break;
    		       		case 3:
    		       			$scope.$apply(function() {
    		       				$scope.keys[rowIndex].name = inputs.get(0).value;
    		       				$scope.keys[rowIndex].userName = inputs.get(1).value;
    		       				$scope.keys[rowIndex].password = inputs.get(2).value;
    		       			});
    		       			break;
    		       		default:
    		       			break;
    		       	}
    		       save({contacts: $scope.contacts, keys: $scope.keys}); // save the change
    		       $(this).dialog("close");
    			}
    		}
    });
}

function initMenus($scope) {
	menu.append(new gui.MenuItem({
		label: 'Copy',
		click: function(){
			clipboard.set(getSelectedText(), 'text');
		}
	}));
	menu.append(new gui.MenuItem( { type: 'separator' }));
	menu.append(new gui.MenuItem({ 
		label: 'Edit',
		click: function() {
			var rowIndex = getSelectedRowIndex();
	    	var index =   getSelectedTabIndex( "#view-tabs" ) ;
	       	switch (index) {
	       		case 0:
	       			var entryObj = $scope.contacts[rowIndex];
	       			$("#editDialog").html("<input value='" + entryObj.name + "'><input value='" + entryObj.addr + "'>");
	       			$("#editDialog").dialog("option", "width", 460);
	       			break;
	       		case 1:
	       			var entryObj = $scope.keys[rowIndex];
	       			$("#editDialog").html("<input value='" + entryObj.name + "'><input value='" + entryObj.userName + 
	       													"'><input value='" + entryObj.password + "'>");
	       			$("#editDialog").dialog("option", "width", 670);
	       			break;
	       		default:
	       			break;
	       	}
	    	$("#editDialog").dialog("open");
		}
	}));
	
	menu.append(new gui.MenuItem({ 
		label: 'Delete',
		click: function() {
			var rowIndex = getSelectedRowIndex();
	    	$scope.$apply(function() {
	    		var index =   getSelectedTabIndex( "#view-tabs" ) ;
	       		switch (index) {
	       		case 0:
	       			$scope.contacts.splice(rowIndex, 1);
	       			break;
	       		case 1:
	       			$scope.keys.splice(rowIndex, 1);
	       			break;
	       		default:
	       			break;
	       		}
	    	});
	    	save({contacts: $scope.contacts, keys: $scope.keys});
		}
	}));
	
	menu_input.append(new gui.MenuItem({
		label: 'Paste',
		click: function() {
			document.activeElement.value = clipboard.get('text');
		}
	}));
}

/**
 * Encrypts the data with provided password
 * @param plainContent the data before being encrypted
 * @param pwd provided password
 * @returns the encrypted content
 */
function encryptContent(plainContent) {
	var cipher = crypto_node.createCipher("aes256", pwd);
	return cipher.update(plainContent, "utf8", "base64") + cipher.final("base64");
}

/**
 * Decrypts the data with the provided password
 * @param encryptedContent the encrypted data
 * @param pwd the provided password
 * @returns the plain content
 */
function decryptContent(encryptedContent, password) {
	var decipher = crypto_node.createDecipher("aes256", password);
	return decipher.update(encryptedContent, "base64", "utf8") + decipher.final("utf8");
}
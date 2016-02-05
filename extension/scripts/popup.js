'use strict'; 
/*global window, chrome, document*/

chrome.runtime.sendMessage({method: 'isEnabled'}, function(response) {
	document.forms[0].enabled.checked = response.enabled;
});

document.forms[0].enabled.addEventListener('click', function () {
	chrome.runtime.sendMessage({
		method: 'setEnabled',
		enabled: document.forms[0].enabled.checked
	});
});

document.forms[0].showwidget.addEventListener('click', function () {
	chrome.runtime.sendMessage({
		method: 'showWidget'
	});
});
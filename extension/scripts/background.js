'use strict';
/*global chrome, localStorage*/

var enabled;

if (localStorage.getItem('enabled') === null) {
	enabled = true;
} else {
	enabled = !!Number(localStorage.getItem('enabled'));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if (request.method === 'isEnabled') {
		sendResponse({enabled});
	}

	if (request.method === 'setEnabled') {
		enabled = request.enabled;
		localStorage.setItem('enabled', Number(request.enabled));
	}
});

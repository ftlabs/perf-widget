'use strict'; // eslint-disable-line strict
/*global chrome, localStorage*/

let enabled;

if (localStorage.getItem('enabled') === null) {
	enabled = true;
} else {
	enabled = localStorage.getItem('enabled') === "true";
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if (request.method === 'isEnabled') {
		sendResponse({enabled});
	}

	if (request.method === 'setEnabled') {
		enabled = request.enabled;
		localStorage.setItem('enabled', String(request.enabled));
	}
});

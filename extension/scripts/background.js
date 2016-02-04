'use strict';
/*global chrome, localStorage*/

let enabled;

if (localStorage.getItem('enabled') === null) {
	enabled = true;
} else {
	enabled = localStorage.getItem('enabled') === "true";
}

function emitMessage (method, data, url){
	chrome.tabs.query({url}, function (tabs){
		tabs.forEach(function ({id}) {
			chrome.tabs.sendMessage(id, {method, data, url});
		});
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.method === 'isEnabled') {
		sendResponse({enabled});
	}

	if (request.method === 'setEnabled') {
		enabled = request.enabled;
		localStorage.setItem('enabled', String(request.enabled));
	}

	if (request.method === 'getData') {
		emitMessage('updateData', [] ,request.url);
	}
});

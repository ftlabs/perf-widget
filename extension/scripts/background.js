'use strict';
/*global chrome, localStorage*/

const co = require('co');
const apiEndpoint = '/* @echo serviceURL */';

let enabled;

if (localStorage.getItem('enabled') === null) {
	enabled = true;
	localStorage.setItem('enabled', 'true');
} else {
	enabled = localStorage.getItem('enabled') === 'true';
}

function emitMessage (method, data, url){
	chrome.tabs.query({
		url : url
	}, function (tabs){
		tabs.forEach(function (tab) {
			chrome.tabs.sendMessage(tab.id, {method : method, data : data, url : url});
		});
	});
}

function* getData (url) {
	let lastStatus = 202;
	let data = null;
	const apiUrl = `${apiEndpoint}/api/data-for?url=${encodeURIComponent(url)}`;

	const makeAPICall = function () {
		return fetch(apiUrl)
		.then(response => {
			lastStatus = response.status;
			return response.json();
		})
		.then(dataIn => {
			data = dataIn;
			return dataIn;
		});
	}

	const waitThen = function (fn, timeout) {
		return new Promise(resolve => setTimeout(resolve, timeout || 10)).then(fn);
	}

	yield makeAPICall();
	while (lastStatus === 202) {
		yield waitThen(makeAPICall, 1000);
	};
	return data.data;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.method === 'isEnabled') {
		sendResponse({
			enabled : enabled
		});
	}

	if (request.method === 'setEnabled') {
		enabled = request.enabled;
		localStorage.setItem('enabled', String(request.enabled));
	}

	if (request.method === 'showWidget') {
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true
		}, function (tabs){
			tabs.forEach(function (tab) {
				chrome.tabs.sendMessage(tab.id, {method: 'showWidget'});
			});
		});
	}

	if (request.method === 'getData') {
		co(() => getData(request.url))
		.then(data => {
			emitMessage('updateData', data, request.url);
		}, e => {
			throw e;
		});
	}
});

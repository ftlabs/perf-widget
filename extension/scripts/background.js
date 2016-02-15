'use strict'; // eslint-disable-line strict
/*global chrome, localStorage*/

const co = require('co');
const apiEndpoint = '/* @echo serviceURL */';

let enabled;

if (localStorage.getItem('enabled') === null) {
	enabled = true;
} else {
	enabled = localStorage.getItem('enabled') === 'true';
}

const enabledHosts = new Set(JSON.parse(localStorage.getItem('enabledHosts') || '[]'));

// Runs automatically for the FT so be able to disable it for some domains
const disabledFTHosts = new Set(JSON.parse(localStorage.getItem('disabledFTHosts') || '[]'));

function emitMessage (method, data, url){
	chrome.tabs.query({}, function (tabs){
		tabs.forEach(function (tab) {
			chrome.tabs.sendMessage(tab.id, {
				method: method,
				data: data,
				url: url,
				apiEndpoint: apiEndpoint
			});
		});
	});
}

function* getData (url, freshInsights) {
	let lastStatus = 202;
	let data = null;
	freshInsights = freshInsights === true;
	const apiUrl = `${apiEndpoint}/api/data-for?url=${encodeURIComponent(url)}`;

	const makeAPICall = function () {
		return fetch(apiUrl + `&fresh=${freshInsights}`, {cache: 'no-cache'})
		.then(response => {
			freshInsights = false;
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
		yield waitThen(makeAPICall, 3000);
	}

	if (lastStatus === 200) {
		return data.data;
	} else {
		throw Error(data.error);
	}
}

function isHostEnabled (host) {
	if (host.match(/ft.com$/)) {
		return !disabledFTHosts.has(host);
	} else {
		return enabledHosts.has(host);
	}
}

function setHostEnabled (host, enabled) {
	if (host.match(/ft.com$/)) {
		if (enabled) {
			disabledFTHosts.delete(host);
		} else {
			disabledFTHosts.add(host);
		}
		localStorage.setItem('disabledFTHosts', JSON.stringify(Array.from(disabledFTHosts)));
	} else {
		if (enabled) {
			enabledHosts.add(host);
		} else {
			enabledHosts.delete(host);
		}
		localStorage.setItem('enabledHosts', JSON.stringify(Array.from(enabledHosts)));
	}
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.method === 'isEnabled') {
		sendResponse({
			enabled: enabled
		});
	}

	if (request.method === 'isEnabledForThisHost') {
		sendResponse({enabled: enabled && isHostEnabled(request.host)});
	}

	if (request.method === 'setEnabledForThisHost') {
		setHostEnabled(request.host, request.enabled);
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
		co(() => getData(request.url, request.freshInsights))
		.then(data => {
			emitMessage('updateData', data, request.url);
		}, () => {
			emitMessage('updateError', {errorMessage: 'Could not return results, if this persists contact labs@ft.com'}, request.url);
		});
	}
});

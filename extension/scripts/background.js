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

let blackListPromise;
(function updateBlacklist () {
	blackListPromise = fetch(
		'http://bertha.ig.ft.com/view/publish/gss/1_f-cR8VbcujCsjxTLyKVRcG9yp_qUbT0-FrdmwBp0OM/blacklist'
	).then(response => response.json());

	// Once an hour check for new black listed sites.
	setTimeout(updateBlacklist , 3600 * 1000);
}());

function escapeRegExp (str) {
	return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function ensureNotBlackListed (url) {

	return blackListPromise.then(function (data) {
		for (let condition of data) {
			let testRegex;
			if (condition.matchtype === 'regex') {
				testRegex = new RegExp(condition.blacklistsite);
			}
			if (condition.matchtype === 'string') {

				// RegExp to match from the start of the string replacing * with .*
				// Escaping special RegExp characters.
				testRegex = new RegExp('^' + escapeRegExp(condition.blacklistsite).replace(/\\\*/ig, '.*'));
			}
			if (testRegex) {

				// if it matches it is blackListed
				if (!!url.match(testRegex)) {
					throw Error('Sorry this website does not work with the perf widget. The reason given is ' + condition.reason);
				}
			}
		}
	})
}

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

	// Rejects if the url is blacklisted
	yield ensureNotBlackListed(url);

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

	const dateStarted = Date.now();

	while (lastStatus === 202) {

		// wait for minutes then timeout
		if (Date.now() - dateStarted >= 1000 * 240) {
			throw Error('Sorry the request is taking a long time please try again later.');
		}
		yield waitThen(makeAPICall, 3000);
	}

	if (lastStatus === 200) {
		return data.data;
	} else {

		// Error message from the server, don't expose it to the user.
		console.log(data.error);
		throw Error('Could not return results, if this persists contact labs@ft.com');
	}
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.method === 'isEnabled') {
		sendResponse({enabled});
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
		}, e => {
			emitMessage('updateError', {errorMessage: e.message}, request.url);
		});
	}
});

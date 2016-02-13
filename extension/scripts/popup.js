'use strict'; // eslint-disable-line strict
/*global window, chrome, document*/

chrome.runtime.sendMessage({method: 'isEnabled'}, function(response) {
	document.forms[0].enabled.checked = response.enabled;
});

chrome.tabs.query({
	active: true,
	lastFocusedWindow: true
}, function (tabs){
	tabs.forEach(function (tab) {
		const host = (new URL(tab.url)).host;
		document.getElementById('domaingoeshere').textContent = host;
		chrome.runtime.sendMessage({
			method: 'isEnabledForThisHost',
			host: host
		}, response => {
			document.forms[0].enabledforthishost.checked = response.enabled;
		});

		document.forms[0].enabledforthishost.addEventListener('click', function () {
			chrome.runtime.sendMessage({
				method: 'setEnabledForThisHost',
				host: host,
				enabled: document.forms[0].enabledforthishost.checked
			});
		});
	});
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

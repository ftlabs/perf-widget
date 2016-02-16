'use strict'; // eslint-disable-line strict
/*global window, chrome, document*/

chrome.runtime.sendMessage({method: 'isEnabled'}, function (response) {
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

			const enabled = document.forms[0].enabledforthishost.checked;

			chrome.runtime.sendMessage({
				method: 'setEnabledForThisHost',
				host: host,
				enabled: enabled
			});

			chrome.runtime.sendMessage({
				method: 'trackUiInteraction',
				details: {
					action: 'disabledForHost',
					host: host,
					enabled: enabled
				}
			});
		});
	});
});

document.forms[0].enabled.addEventListener('click', function () {

	const enabled = document.forms[0].enabled.checked;

	chrome.runtime.sendMessage({
		method: 'setEnabled',
		enabled: enabled
	});

	chrome.runtime.sendMessage({
		method: 'trackUiInteraction',
		details: {
			action: 'toggleEnabledGlobally',
			enabled: enabled
		}
	});
});

document.forms[0].showwidget.addEventListener('click', function (e) {

	chrome.runtime.sendMessage({
		method: 'trackUiInteraction',
		details: {
			action: 'showWidget'
		}
	});

	chrome.runtime.sendMessage({
		method: 'showWidget'
	});

	e.preventDefault();
});

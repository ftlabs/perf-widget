'use strict';
/*global chrome*/

function loadWidget() {

	// add the widget stylesheet
	require('./lib/widgetstyle');

	const holder = document.createElement('div');
	const close = document.createElement('span');
	const refresh = document.createElement('span');
	const textTarget = document.createElement('div');
	const myUrl = window.location.href;

	function removeSelf (){
		holder.parentNode.removeChild(holder);
		chrome.runtime.onMessage.removeListener(recieveData);
	}

	function getData (url) {
		chrome.runtime.sendMessage({
			method: 'getData',
			url
		});
	}

	function recieveData (request) {
		if (open && request.method === 'updateData' && request.url === myUrl){
			const data = request.data;
			let output = '';

			data.forEach(datum => {
				output += `<h3>${datum.category}</h3><div class="insights"><h4>${datum.provider}</h4>`;
				datum.comparisons.forEach(comparison => {
					output += `<li class="ok-${ comparison.ok }"><a href="${datum.link}" target="_blank">${comparison.text}</a></li>`;
				});
				output += '</div>';

			});

			textTarget.innerHTML = output;
		}
	}

	function refreshFn () {
		textTarget.innerHTML = waitingText;
		getData(myUrl);
	}

	// prepare to recieve data.
	chrome.runtime.onMessage.addListener(recieveData);

	// ask for the data to be updated
	getData(myUrl);


	const waitingText = 'Loading Analysis...';
	textTarget.innerHTML = waitingText;
	holder.appendChild(textTarget);
	holder.appendChild(close);
	holder.appendChild(refresh);

	close.setAttribute('class', 'close');
	close.addEventListener('click', removeSelf, false);

	refresh.setAttribute('class', 'refresh');
	refresh.addEventListener('click', refreshFn, false);

	holder.setAttribute('id', 'perf-widget-holder');
	document.body.appendChild(holder);

	return {
		close: removeSelf,
		refresh: refreshFn
	}
}

let widgetControls;

chrome.runtime.sendMessage({method: 'isEnabled'}, response => {
	if (response.enabled && location.hostname.match(/ft.com$/)) widgetControls = loadWidget();
});

chrome.runtime.onMessage.addListener(function (request) {
	if (request.method === 'showWidget'){
		if (widgetControls) {
			widgetControls.refresh();
		} else {
			widgetControls = loadWidget();
		}
	}
});

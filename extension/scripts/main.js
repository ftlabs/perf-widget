'use strict'; // eslint-disable-line strict
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

	function getData (url, freshInsights) {
		chrome.runtime.sendMessage({
			method: 'getData',
			url: url,
			freshInsights: freshInsights
		});
	}

	function recieveData (request) {

		if (request.method === 'updateError') {
			textTarget.innerHTML = request.data.errorMessage;
		}

		if (open && request.method === 'updateData' && request.url === myUrl) {
			const data = request.data;
			let output = '';
			const categories = {};

			data.forEach(datum => {

				if(categories[datum.category] === undefined && datum.category !== undefined){
					categories[datum.category] = [];
				}

				categories[datum.category].push(datum);

			})

			Object.keys(categories).forEach(key =>{

				output += `<h3>${key}</h3><div class="insights">`;
				categories[key].forEach(datum => {

					datum.comparisons.forEach(comparison => {
						output += `<li class="ok-${ comparison.ok }"><a href="${datum.link}" target="_blank" title="${datum.provider}">${comparison.text}</a></li>`;
					});

				});
				output += '</div>';


			});

			textTarget.innerHTML = output;
		}
	}

	function refreshFn (freshInsights) {
		textTarget.innerHTML = waitingText;
		getData(myUrl, freshInsights);
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
	refresh.addEventListener('click', function(){
		refreshFn(true);
	}, false);

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
	if (request.method === 'showWidget') {
		if (widgetControls) {
			widgetControls.refresh();
		} else {
			widgetControls = loadWidget();
		}
	}
});

'use strict';
/*global chrome*/

chrome.runtime.sendMessage({method: 'isEnabled'}, function (response) {
	if (!response.enabled) return;

	require('./libs/widgetstyle');

	const holder = document.createElement('div');
	const close = document.createElement('span');
	const refresh = document.createElement('span');
	const textTarget = document.createElement('div');
	const myUrl = window.location.href;

	function removeSelf (){
		holder.parentNode.removeChild(holder);
	}

	function getData (url) {
		chrome.runtime.sendMessage({
			method: 'getData',
			url
		});
	}

	const existingHolder = document.querySelector('#perf-widget-holder');
	if(existingHolder !== null){
		existingHolder.parentNode.removeChild(existingHolder);
	}

	getData(myUrl);

	chrome.runtime.onMessage.addListener(function (request) {
		if (request.method === 'updateData' && request.url === myUrl){
			const data = request.data;
			let output = '';
			window.perfWidgeGlobals.freshInsights = true;

			data.forEach(datum => {
				output += `<h3>${datum.category}</h3><div class="insights"><h4>${datum.provider}</h4>`;
				datum.comparisons.forEach(comparison => {
					output += `<li class="ok-${ comparison.ok }"><a href="${datum.link}" target="_blank">${comparison.text}</a></li>`;
				});
				output += '</div>';

			});

			textTarget.innerHTML = output;
		}
	});

	textTarget.innerHTML = 'Loading Analysis...'
	holder.appendChild(textTarget);
	holder.appendChild(close);
	holder.appendChild(refresh);

	close.setAttribute('class', 'close');
	close.addEventListener('click', function (){
		removeSelf();
	}, false);

	refresh.setAttribute('class', 'refresh');
	refresh.addEventListener('click', function () {
		getData(myUrl);
	}, false);

	holder.setAttribute('id', 'perf-widget-holder');
	document.body.appendChild(holder);
});

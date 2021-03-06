'use strict'; // eslint-disable-line strict
/*global chrome*/

const Color = require('./lib/color').Color;
const oTracking = require('o-tracking');

const noColorCalculatedStyle = (function () {
	const temp = document.createElement('div');
	document.body.appendChild(temp);
	const styleAttr = window.getComputedStyle(temp).backgroundColor;
	document.body.removeChild(temp);
	return styleAttr;
}());

function nodesWithTextNodesUnder (el) {
	const elementsWithTextMap = new Map();
	const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
	let textNode;
	while(textNode = walk.nextNode()) {

		if (textNode.parentNode === undefined) {
			continue;
		}

		// ignore just whitespace nodes
		if (textNode.data.trim().length > 0) {
			if (elementsWithTextMap.has(textNode.parentNode)) {
				elementsWithTextMap.get(textNode.parentNode).push(textNode);
			} else {
				elementsWithTextMap.set(textNode.parentNode, [textNode]);
			}
		}
	}
	return Array.from(elementsWithTextMap);
}

function getBackgroundColorForEl (el) {

	const bgc = window.getComputedStyle(el).backgroundColor;
	if (bgc !== noColorCalculatedStyle && bgc !== '') {
		return bgc;
	} else if (el.parentNode) {
		if (el.parentNode !== document) {
			return getBackgroundColorForEl(el.parentNode);
		}
	}
	return null;
}


function getContrastForEl (el) {
	const style = window.getComputedStyle(el);
	const color = style.color;
	const backgroundColor = getBackgroundColorForEl(el) || 'rgba(255, 255, 255, 1)';
	const bColor = new Color(backgroundColor);
	const fColor = new Color(color);
	return bColor.contrast(fColor);
}

function generateContrastData () {

	const textNodes = nodesWithTextNodesUnder(document.body);
	let goodChars = 0;
	let badChars = 0;
	let chartData = [
		0, 0, 0, 0, 0,
		0, 0, 0, 0, 0,
		0, 0, 0, 0, 0,
		0
	]; // buckets representing 0-(15+)
	textNodes.forEach(inNode => {
		const n = inNode[0];
		const ratio = getContrastForEl(n).ratio;
		const noCharacters = inNode[1].map(t => t.length).reduce((a,b) => a + b, 0);
		const bucket = Math.min(15, Math.round(ratio));
		chartData[bucket] += noCharacters;
		if (ratio < 4.5) {
			badChars += noCharacters;
		} else {
			goodChars += noCharacters;
		}
	});

	return {
		proportionBadContrast: badChars / (goodChars + badChars),
		chartData: chartData.map(i => (i/(badChars + goodChars))) // average the data to keep numbers small
	}
}

function logInteraction (e) {
	const details = {};
	const context = e.target.dataset.trackingAction;
	if (e.target.tagName === 'A') {
			details.action = 'widget-link-click';
			details.destination = e.target.href;
			if (context) details.context = context;
	} else if (context) {
			details.action = 'click';
			details.context = context;
	}

	if (details.action) {
		chrome.runtime.sendMessage({
			method: 'trackUiInteraction',
			details: details
		});
	}
}

// The background script picks the active tab in the active window to make
// this request since it cannot be made from the background script
function makeTrackingRequest (details, identity) {

	const trackingReq = details;
	trackingReq.category = 'ftlabs-performance-widget';
	trackingReq.id = identity.id;
	trackingReq.email = identity.email;

	// may not work without a DOM, may have to redirect to active tab.
	oTracking.init({
		server: 'https://spoor-api.ft.com/px.gif',
		context: {
			product: 'ftlabs-perf-widget'
		}
	});

	oTracking.event({
		detail: trackingReq
	});
}

function loadWidget () {

	// add the widget stylesheet
	require('./lib/widgetstyle');

	const header = document.createElement('div');
	const holder = document.createElement('div');
	const close = document.createElement('span');
	const refresh = document.createElement('span');
	const textTarget = document.createElement('div');
	const footer = document.createElement('div');
	const myUrl = window.location.href;
	const apiEndpoint = '/* @echo serviceURL */';

	function removeSelf (){
		widgetControls = null;
		holder.parentNode.removeChild(holder);
		chrome.runtime.onMessage.removeListener(recieveData);
	}

	function getData (url, freshInsights) {
		chrome.runtime.sendMessage({
			method: 'getData',
			url: url,
			freshInsights : freshInsights
		});
	}

	function recieveData (request) {

		if (request.method === 'updateError') {
			textTarget.innerHTML = request.data.errorMessage;
		}

		if (open && request.method === 'updateData' && request.url === myUrl) {
			const data = request.data;

			try {
				const contrastData = generateContrastData();

				data.push({
					category: 'Accessibility',
					provider: 'Local Page Contrast',
					comparisons: [{
						ok: contrastData.proportionBadContrast < 0.2,
						text: `${Math.round((1-contrastData.proportionBadContrast)*100)}% of the text has good contrast.<div style="display: block;" class='perf-widget-accessibility-chart'></div>`
					}],
					link: `${apiEndpoint}/contrastbreakdown/?url=${encodeURIComponent(location.toString())}&data=${contrastData.chartData.join(',')}`
				});
			} catch (e) {

				// in the event of weird DOM causing the above to break don't break the rest of the data display.
				console.error(e.message, e.stack);
			}

			let output = '';

			// Produce data structure combining categories and providers
			const reducedData = [];
			(function () {
				const data2 = new Map();
				data.forEach(datum => {
					if (!data2.has(datum.category)) {
						data2.set(datum.category, new Map());
					}
					if (!data2.get(datum.category).has(datum.provider)) {
						data2.get(datum.category).set(datum.provider, datum);
						reducedData.push(datum);
					} else {
						data2.get(datum.category).get(datum.provider).comparisons = data2.get(datum.category).get(datum.provider).comparisons.concat(datum.comparisons);
					}
				});
			}());

			reducedData.forEach(datum => {
				output += `<h3>${datum.category} <a data-tracking-action="insight-link" href="${apiEndpoint}/insights/#${datum.category.toLowerCase().replace(/[^a-z]+/, '')}">ⓘ</a></h3><div class="insights">`;
				datum.comparisons.forEach(comparison => {
					output += `<li class="ok-${ comparison.ok }"><a data-tracking-action="data-link-ok-${ comparison.ok }" href="${datum.link}" target="_blank" title="${datum.provider}">${comparison.text}</a></li>`;
				});
				output += '</div>';
			});

			textTarget.innerHTML = output;
		}
	}

	function refreshFn () {
		textTarget.innerHTML = waitingText;
		getData(myUrl, true);
	}

	// prepare to recieve data.
	chrome.runtime.onMessage.addListener(recieveData);

	// ask for the data to be updated
	getData(myUrl);

	const waitingText = 'Loading Analysis...';
	textTarget.innerHTML = waitingText;
	holder.appendChild(textTarget);
	holder.appendChild(header);
	header.appendChild(close);
	header.appendChild(refresh);
	holder.appendChild(footer);
	holder.addEventListener('click', logInteraction);

	footer.innerHTML = `<h3><a data-tracking-action="why-am-i-seeing-this" href="${apiEndpoint}/">Why am I seeing this?</a></h3>`;
	footer.classList.add('footer');

	close.classList.add('close');
	close.dataset.trackingAction = 'close';
	close.addEventListener('click', removeSelf, false);

	refresh.classList.add('refresh');
	refresh.dataset.trackingAction = 'refresh';
	refresh.addEventListener('click', refreshFn, false);

	holder.setAttribute('id', 'perf-widget-holder');
	document.body.appendChild(holder);

	return {
		close: removeSelf,
		refresh: refreshFn
	}
}

let widgetControls;

chrome.runtime.sendMessage({
	method: 'isEnabledForThisHost',
	host: location.host
}, response => {
	if (response.enabled) widgetControls = loadWidget();
});

chrome.runtime.onMessage.addListener(function (request) {

	if (request.method === 'showWidget') {
		if (widgetControls) {
			widgetControls.refresh();
		} else {
			widgetControls = loadWidget();
		}
	}

	if (request.method === 'makeTrackingRequest') {
		makeTrackingRequest(request.data.details, request.data.identity);
	}
});

'use strict';
/*global chrome*/

const Color = require('./lib/color').Color;

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
	if (el.style && (el.style.background || el.style.backgroundColor)) {
		const style = window.getComputedStyle(el);
		return style.backgroundColor;
	} else if (el.parentNode) {
		return getBackgroundColorForEl(el.parentNode);
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
	const badNodes = [];
	let goodChars = 0;
	let badChars = 0;
	textNodes.forEach(inNode => {
		const n = inNode[0];
		const ratio = getContrastForEl(n).ratio;
		const noCharacters = inNode[1].map(t => t.length).reduce((a,b) => a + b, 0);
		if (ratio < 4) {
			badNodes.push(n);
			badChars += noCharacters;
		} else {
			goodChars += noCharacters;
		}
	});
	return {
		badContrastNodes: badNodes,
		proportionBadContrast: badChars / goodChars
	}
}

function loadWidget () {

	// add the widget stylesheet
	require('./lib/widgetstyle');

	const holder = document.createElement('div');
	const close = document.createElement('span');
	const refresh = document.createElement('span');
	const textTarget = document.createElement('div');
	const footer = document.createElement('div');
	const myUrl = window.location.href;
	const apiEndpoint = '/* @echo serviceURL */';

	function removeSelf (){
		holder.parentNode.removeChild(holder);
		chrome.runtime.onMessage.removeListener(recieveData);
	}

	function getData (url) {
		chrome.runtime.sendMessage({
			method: 'getData',
			url: url
		});
	}

	function recieveData (request) {

		if (request.method === 'updateError') {
			textTarget.innerHTML = request.errorMessage;
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
						text: `${Math.round((1-contrastData.proportionBadContrast)*100)}% of the text has good contrast.`
					}],
					link:'https://www.w3.org/TR/WCAG/#visual-audio-contrast'
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
				output += `<h3>${datum.category} <a  href="${apiEndpoint}/insights/#${datum.category.toLowerCase().replace(/[^a-z]+/, '')}">ⓘ</a></h3><div class="insights">`;
				datum.comparisons.forEach(comparison => {
					output += `<li class="ok-${ comparison.ok }"><a href="${datum.link}" target="_blank" title="${datum.provider}">${comparison.text}</a></li>`;
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
	holder.appendChild(footer)

	footer.innerHTML = `<a href="${apiEndpoint}/"><h3>Why am I seeing this?</h3></a>`;
	footer.classList.add('footer');

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
	if (request.method === 'showWidget') {
		if (widgetControls) {
			widgetControls.refresh();
		} else {
			widgetControls = loadWidget();
		}
	}
});

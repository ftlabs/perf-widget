'use strict';
/*global chrome*/

chrome.runtime.sendMessage({method: 'isEnabled'}, function(response) {
	if (!response.enabled) return;
	window.perfWidgetUrl = 'https://ftlabs-perf-widget-test.herokuapp.com';
	require('../../client/src/bookmarklet.js');
});

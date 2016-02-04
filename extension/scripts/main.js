'use strict';

chrome.runtime.sendMessage({method: 'isEnabled'}, function(response) {
	window.perfWidgetUrl = 'https://ftlabs-perf-widget.herokuapp.com/';
	require('../../client/src/bookmarklet.js');
});

'use strict';
/*global chrome*/

chrome.runtime.sendMessage({method: 'isEnabled'}, function(response) {
	if (!response.enabled) return;
	require('../../client/src/bookmarklet.js');
});

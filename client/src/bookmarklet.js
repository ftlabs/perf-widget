/* eslint-disable */
var sEl=document.createElement('script');
var perfWidgetUrl = '/* @echo serviceURL */';
var srcAddress = perfWidgetUrl + "/client/data-for?url=" + window.encodeURIComponent(window.location.href) + "&d=" + Date.now();

if(window.pWidgeGlobals !== undefined){
	if(window.pWidgeGlobals.freshInsights){
		srcAddress += "&fresh=true";
	}	
}

sEl.setAttribute('id', 'perf-widget-script-src');
sEl.setAttribute('src', srcAddress);

var existingScript = document.querySelector('#perf-widget-script-src');
var existingHolder = document.querySelector('#perf-widget-holder');

if (existingScript !== null){
	existingScript.parentNode.removeChild(existingScript);
}
if(existingHolder !== null){
	existingHolder.parentNode.removeChild(existingHolder);
}
document.body.appendChild(sEl);

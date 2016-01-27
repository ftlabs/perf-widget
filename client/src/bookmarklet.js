/* eslint-disable */
var sEl=document.createElement('script');
var srcAddress = '/* @echo serviceURL */' + "/client/data-for?url=" + window.encodeURIComponent(window.location.href);

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
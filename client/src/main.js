/* Global fetch */
(function (){

	const serviceRoot = '/* @echo serviceURL */';
	const holder = document.createElement('div');

	holder.style.bottom = '20px';
	holder.style.right = '20px';
	holder.style.width = '300px';
	holder.style.height = '300px';
	holder.style.position = 'fixed';
	holder.style.backgroundColor = '#333';
	holder.style.zIndex = "100";
	holder.setAttribute('class', 'perf_widget');

	fetch(serviceRoot + "/data-for?sig=" + encodeURIComponent(window.location.href) ).then(res => {return res;}).then(data => {console.log(data);})

	document.body.appendChild(holder);

}());




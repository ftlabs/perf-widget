/* Global fetch */
(function (){

	const serviceRoot = '/* @echo serviceURL */';
	const holder = document.createElement('div');
	const style = document.createElement('style');

	holder.setAttribute('id', 'perf-widge-holder');
	style.setAttribute('scoped', 'true');

	style.textContent = `

		#perf-widge-holder {
			position: fixed;
			bottom : 20px;
			right : 20px;
			width : 300px;
			height : 300px;
			background-color : #333;
			z-index : 100;
		}

	`;

	fetch(serviceRoot + "/data-for?sig=" + encodeURIComponent(window.location.href) ).then(res => {return res;}).then(data => {console.log(data);})

	holder.appendChild(style);
	document.body.appendChild(holder);

}());




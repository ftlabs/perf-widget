/* Global Math, console */
(function (){

	const serviceRoot = '/* @echo serviceURL */';
	const holder = document.createElement('div');
	const style = document.createElement('style');
	holder.setAttribute('id', 'perf-widge-holder');

	style.textContent = `

		#perf-widge-holder {
			position: fixed;
			bottom : 20px;
			right : 20px;
			width : 250px;
			height : 300px;
			background-color : #333;
			z-index : 2147483647;
			border-radius: 5px;
		    box-shadow: 0 0 5px black;
		}

	`;

	document.head.appendChild(style);
	document.body.appendChild(holder);

}());




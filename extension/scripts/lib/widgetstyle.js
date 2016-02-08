
const style = document.createElement('style');

style.textContent = `

	#perf-widget-holder {
		all: initial;
	}

	#perf-widget-holder * {
		all: unset;
	}

	#perf-widget-holder > * {
		font-weight: 100;
	}

	#perf-widget-holder {
		position: fixed;
		bottom : 20px;
		right : 20px;
		width : 250px;
		max-height : 300px;
		overflow-y: auto;
		background-color : #333;
		z-index : 2147483647;
		border-radius: 5px;
		box-shadow: 0 0 5px black;
		color: white;
		box-sizing: border-box;
		padding: 10px;
		font-size: 14px;
		padding-bottom: 20px;
		font-family: Helvetica, Arial, sans-serif;
	}

	#perf-widget-holder .close {
		position: absolute;
		right: 5px;
		top: 5px;
		color: rgba(255,255,255,.5);
		border: 1px solid white;
		width: 1em;
		height: 1em;
		text-align: center;
		border-radius: 100%;
		cursor: pointer;
		background-size: 50%;
		background-position: 50%;
		background-repeat: no-repeat;
		background-image: url('/images/cross.png');
	}

	#perf-widget-holder .refresh {
		position: absolute;
		right: 30px;
		top: 5px;
		color: rgba(255,255,255,.5);
		width: 1em;
		height: 1em;
		text-align: center;
		border-radius: 100%;
		cursor: pointer;
		background-size: 80%;
		background-position: 50%;
		background-repeat: no-repeat;
		background-image: url('/images/refresh.png');
	}

	#perf-widget-holder h3:first-of-type {
		margin-top:0;
	}

	#perf-widget-holder h3{
		margin-top: 10px;
		display: block;
		font-weight: bold;
	}

	#perf-widget-holder .insights {
	    display: block;
	    margin-top: 5px;
	}

	#perf-widget-holder .insights h4{
		font-size: 0.8em;
		margin-top: 0;
		margin-bottom : 0.3em;
	}

	#perf-widget-holder .insights li {
		list-style-type: none;
		padding: 0;
		margin: 0;
		font-size: 0.8em;
		width: 90%;
		margin-left: 10%;
		display: inline-block;
	}

	#perf-widget-holder .insights li::before {
		width: 1em;
		height: 1em;
		display: inline-block;
		content: "";
		margin-right: 0.5em;
		background-size: 100%;
		padding-top: 2px;
		background-position: 50%;
		background-repeat: no-repeat;
		background-image: url('/images/unsure.png');
		position: absolute;
		margin-left: -18px;
	}

	#perf-widget-holder .insights li.ok-true::before {
		background-image: url('/images/check.png');
	}

	#perf-widget-holder .insights li.ok-false::before {
		background-image: url('/images/issue.png');
	}

	#perf-widget-holder .insights li a {
		color: rgba(255,255,255,.8);
		border: 0 solid black;
		text-decoration:none;
		display: inline-block;
	}

	#perf-widget-holder .footer {
		display: block;
		text-align: right;
		text-decoration: underline;
		font-size: 0.8em;
		margin-top: 1em;
	}

`;

document.head.appendChild(style);

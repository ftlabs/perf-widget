'use strict';
const Chart = require('chart.js');

// Add the accessibility chart
const chartWrapper = document.getElementById('contrastChartWrapper');
const url = decodeURIComponent(location.search.split('url=')[1].split('&')[0]);
const chartData = location.search.split('data=')[1].split(',').map(Number).map(n => n.toFixed(2)).map(Number);
const canvas = document.createElement('canvas');
const width = 480;
canvas.width = width;
canvas.height = width / 1.5;
const title = document.createElement('h3');
chartWrapper.appendChild(title);
title.innerHTML = `Contrast Ratio for: <a href="${url}" target="_blank">${url}</a>`;
const yLegend = document.createElement('div');
chartWrapper.appendChild(yLegend);
yLegend.innerHTML = 'Proportion of Characters';
const ctx = canvas.getContext('2d');
chartWrapper.appendChild(canvas);
const xLegend = document.createElement('div');
chartWrapper.appendChild(xLegend);
xLegend.innerHTML = 'Contrast Ratio (Higher is better)';
xLegend.style.textAlign = 'right';

const grd = ctx.createLinearGradient(0.000, 150.000, width, 150.000);

// Add colors
grd.addColorStop(0.000, 'rgba(255, 0, 0, 1.000)');
grd.addColorStop(0.470, 'rgba(219, 178, 30, 1.000)');
grd.addColorStop(1.000, 'rgba(95, 191, 0, 1.000)');

const line = new Chart(ctx).Line({
	labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,'15+'],
	datasets: [{
		label: 'Contrast',
		fillColor: grd,
		strokeColor: 'rgba(220,220,220,1)',
		pointColor: 'rgba(220,220,220,1)',
		pointStrokeColor: '#fff',
		pointHighlightFill: '#fff',
		pointHighlightStroke: 'rgba(220,220,220,1)',
		data: chartData
	}]
}, {
	pointDot: false,
	pointHitDetectionRadius : 0,
	scaleOverride: true,
	scaleSteps: 5,
	scaleStepWidth: 0.2,
	scaleStartValue: 0
});

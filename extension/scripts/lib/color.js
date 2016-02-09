// From lea Verous Color Contrast tool.
// https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/color.js 
// 2016-02-08

const self = module.exports;

// Extend Math.round to allow for precision
Math.round = (function(){
	var round = Math.round;
	
	return function (number, decimals) {
		decimals = +decimals || 0;
		
		var multiplier = Math.pow(10, decimals);
		
		return round(number * multiplier) / multiplier;
	};
})();

// Simple class for handling sRGB colors
(function(){

var _ = self.Color = function(rgba) {
	if (rgba === 'transparent') {
		rgba = [0,0,0,0];
	}
	else if (typeof rgba === 'string') {
		var rgbaString = rgba;
		rgba = rgbaString.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/);
		
		if (rgba) {
			rgba.shift();
		}
		else {
			throw new Error('Invalid string: ' + rgbaString);
		}
	}
	
	if (rgba[3] === undefined) {
		rgba[3] = 1;	
	}
	
	rgba = rgba.map(function (a) { return Math.round(a, 3) });
	
	this.rgba = rgba;
}

_.prototype = {
	get rgb () {
		return this.rgba.slice(0,3);
	},
	
	get alpha () {
		return this.rgba[3];
	},
	
	set alpha (alpha) {
		this.rgba[3] = alpha;
	},
	
	get luminance () {
		// Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
		var rgba = this.rgba.slice();
		
		for(var i=0; i<3; i++) {
			var rgb = rgba[i];
			
			rgb /= 255;
			
			rgb = rgb < .03928 ? rgb / 12.92 : Math.pow((rgb + .055) / 1.055, 2.4);
			
			rgba[i] = rgb;
		}
		
		return .2126 * rgba[0] + .7152 * rgba[1] + 0.0722 * rgba[2];
	},
	
	get inverse () {
		return new _([
			255 - this.rgba[0],
			255 - this.rgba[1],
			255 - this.rgba[2],
			this.alpha
		]);
	},
	
	toString: function() {
		return 'rgb' + (this.alpha < 1? 'a' : '') + '(' + this.rgba.slice(0, this.alpha >= 1? 3 : 4).join(', ') + ')';
	},
	
	clone: function() {
		return new _(this.rgba);
	},
	
	// Overlay a color over another
	overlayOn: function (color) {
		var overlaid = this.clone();
		
		var alpha = this.alpha;
		
		if (alpha >= 1) {
			return overlaid;
		}
		
		for(var i=0; i<3; i++) {
			overlaid.rgba[i] = overlaid.rgba[i] * alpha + color.rgba[i] * color.rgba[3] * (1 - alpha);
		}
		
		overlaid.rgba[3] = alpha + color.rgba[3] * (1 - alpha)
		
		return overlaid;
	},
	
	contrast: function (color) {
		// Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
		var alpha = this.alpha;
		
		if (alpha >= 1) {
			if (color.alpha < 1) {
				color = color.overlayOn(this);
			}
			
			var l1 = this.luminance + .05,
				l2 = color.luminance + .05,
				ratio = l1/l2;
			
			if (l2 > l1) {
				ratio = 1 / ratio;
			}
			
			ratio = Math.round(ratio, 1);
			
			return {
				ratio: ratio,
				error: 0,
				min: ratio,
				max: ratio
			}
		}
		
		// If we’re here, it means we have a semi-transparent background
		// The text color may or may not be semi-transparent, but that doesn't matter
		
		var onBlack = this.overlayOn(_.BLACK).contrast(color).ratio,
		    onWhite = this.overlayOn(_.WHITE).contrast(color).ratio;
		    
		var max = Math.max(onBlack, onWhite);
		
		var closest = this.rgb.map(function(c, i) {
			return Math.min(Math.max(0, (color.rgb[i] - c * alpha)/(1-alpha)), 255);
		});
		
		closest = new _(closest);

		var min = this.overlayOn(closest).contrast(color).ratio;
				
		return {
			ratio: Math.round((min + max) / 2, 2),
			error: Math.round((max - min) / 2, 2),
			min: min,
			max: max,
			closest: closest,
			farthest: onWhite == max? _.WHITE : _.BLACK
		};
	}
}

_.BLACK = new _([0,0,0]);
_.GRAY = new _([127.5, 127.5, 127.5]);
_.WHITE = new _([255,255,255]);

})();

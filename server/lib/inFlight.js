const inFlight = new Map();

module.exports = {
	has: function (url) {
		return inFlight.has(url);
	},
	add: function (url) {
		return inFlight.set(url);
	},
	remove: function(url) {
		return inFlight.delete(url);
	}
};

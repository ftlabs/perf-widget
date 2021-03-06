const debug = require('debug')('perf-widget:lib:isConcerningValue'); // eslint-disable-line no-unused-vars

const query = require('./database').query;

const command = `SELECT name, minimum, maximum FROM properties`;

const queryResult = query(command);

const propertyThresholds = queryResult.then(function(rows) {

	return new Map(rows.map(function (row) {
		const minimum = row.minimum || -Infinity;
		const maximum = row.maximum || Infinity;

		return [row.name, function(value) {
				if(value === null){
					return true;
				}
				if (value <= minimum) {
					return true;
				} else if (value >= maximum) {
					return true;
				} else {
					return false;
				}
			}
		];
	}));
});

module.exports = function isConcerningValue(name, value) {
	return propertyThresholds.then(function(propertyThresholdsMap) {
		return propertyThresholdsMap.get(name)(value);
	})
};

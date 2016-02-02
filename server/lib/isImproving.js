const debug = require('debug')('perf-widget:lib:isImproving'); // eslint-disable-line no-unused-vars

const query = require('./database').query;

const command = `SELECT name, percentage_difference FROM properties`;

const queryResult = query(command);

const propertyThresholds = queryResult.then(function(rows) {

	return new Map(rows.map(function (row) {
		const threshold = row['percentage_difference'];

		return [
			row.name, 
			function(averageValue, currentValue) {
				debug('threshold:', threshold);
				
				if (threshold === undefined || threshold === null) {
					return null;
				}

				const difference = (1 - (averageValue / currentValue)) * 100;
				const negativeDifference = difference <= 0;

				debug(difference, negativeDifference)
				
				if (Math.abs(difference) === threshold) {
					return null;
				}

				if (Math.abs(difference) > threshold && negativeDifference) {
					return false;
				}

				if (Math.abs(difference) > threshold) {
					return true;
				}

				return null;
			}
		];
	}));
});

module.exports = function isImproving(name, averageValue, currentValue) {
	return propertyThresholds.then(function(propertyThresholdsMap) {
		debug(propertyThresholdsMap, name, averageValue, currentValue)
		return propertyThresholdsMap.get(name)(averageValue, currentValue);
	})
};

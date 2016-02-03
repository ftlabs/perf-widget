const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:getLatestValuesFor');
const isConcerningValue = require('./isConcerningValue');
const betterThanFT = require('./betterThanFT');
const isFT = require('./isFT');

module.exports = function getLatestValuesFor(url) {
	const command = `SELECT properties.name, properties.category, properties.provider, properties.better_than_ft, properties.worse_than_ft, properties.concerning_text, properties.reassuring_text, current_values.link, current_values.value FROM current_values JOIN properties ON properties.id = current_values.property_id JOIN page ON page.id = current_values.page_id AND page.url = ${escape(url)};`;

	const queryResult = query(command);

	return queryResult.then(function(rows) {
		if (isFT(url)) {
			const result = rows.map(function (row) {

				return Promise.all([
					isConcerningValue(row.name, row.value), 
					betterThanFT(row.name, row.value)
				]).then(function (values) {
					const concerning = values[0];
					const betterThanOtherFTProducts = values[1];

					const ok = betterThanOtherFTProducts === undefined ? !concerning : betterThanOtherFTProducts;

					var text; // eslint-disable-line no-var

					if (betterThanOtherFTProducts === undefined) {
						if (concerning) {
							text = row.concerning_text;
						} else {
							text = row.reassuring_text;
						}
					} else {
						if (betterThanOtherFTProducts) {
							text = row.better_than_ft;
						} else {
							text = row.worse_than_ft;
						}
					}

					return {
						category: row.category,
						provider: row.provider,
						text: text,
						link: row.link,
						ok: ok
					};
				});
			});

			return Promise.all(result);
		} else {
			return rows.map(function (row) {
				return {
					category: row.category,
					provider: row.provider,
					link: row.link
				};
			});
		}
	});
};

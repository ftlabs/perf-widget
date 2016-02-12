const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:getLatestValuesFor'); // eslint-disable-line no-unused-vars
const isConcerningValue = require('./isConcerningValue');
const betterThanFT = require('./betterThanFT');
const isFT = require('./isFT');
const betterThanCompetitors = require('./betterThanCompetitors');

module.exports = function getLatestValuesFor(url) {
	const command = `SELECT page.type, properties.name, properties.category, properties.provider, properties.better_than_competitor, properties.worse_than_competitor, properties.better_than_ft, properties.worse_than_ft, properties.concerning_text, properties.reassuring_text, current_values.link, current_values.value FROM current_values JOIN properties ON properties.id = current_values.property_id JOIN page ON page.id = current_values.page_id AND page.url = ${escape(url)};`;

	const queryResult = query(command);

	return queryResult.then(function(rows) {
		const ft = isFT(url);
		const result = rows.map(function (row) {

			return Promise.all([
				isConcerningValue(row.name, row.value), 
				ft ? betterThanFT(row.name, row.value) : undefined,
				ft ? betterThanCompetitors(row.name, row.value, row.type) : undefined
			]).then(function (values) {
				const concerning = values[0];
				const betterThanOtherFTProducts = values[1];
				const betterThanCompetitorProducts = values[2];

				const results = [];

				if (concerning) {
					results.push({
						ok: false,
						text: row.concerning_text
					});
				} else {
					results.push({
						ok: true,
						text: row.reassuring_text
					});
				}

				if (betterThanOtherFTProducts !== undefined) {
					if (betterThanOtherFTProducts) {
						results.push({
							ok: true,
							text: row.better_than_ft
						});
					} else {
						results.push({
							ok: false,
							text: row.worse_than_ft
						});
					}
				}

				if (betterThanOtherFTProducts !== undefined) {
					if (betterThanOtherFTProducts) {
						results.push({
							ok: true,
							text: row.better_than_ft
						});
					} else {
						results.push({
							ok: false,
							text: row.worse_than_ft
						});
					}
				}

				if (betterThanCompetitorProducts !== undefined) {
					betterThanCompetitorProducts['false'].forEach(function(result) {
						results.push({
							ok: false,
							text: `${row.worse_than_competitor} ${result.domain}`
						});
					});
					betterThanCompetitorProducts['true'].forEach(function(result) {
						results.push({
							ok: true,
							text: `${row.better_than_competitor} ${result.domain}`
						});
					});
				}

				return {
					category: row.category,
					provider: row.provider,
					comparisons: results,
					link: row.link
				};
			});
		});

		return Promise.all(result);
	});
};

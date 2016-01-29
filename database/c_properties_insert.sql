INSERT IGNORE INTO `properties` (`id`, `name`, `description`, `minimum`, `maximum`, `category`, `provider`)
VALUES
	(1, 'PageSpeedInsightsScore', 'The score from PageSpeed Insights', 60, 100, 'Performance', 'Google Pagespeed'),
	(2, 'VulnerableToBeast', 'The server is vulnerable to the BEAST attack', -1, 1, 'Security', 'SSL Labs');

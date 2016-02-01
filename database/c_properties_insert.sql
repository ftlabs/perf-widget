INSERT IGNORE INTO `properties` (`id`, `name`, `description`, `minimum`, `maximum`, `category`, `provider`)
VALUES
	(1, 'PageSpeedInsightsScore', 'This page is slow', 60, 100, 'Performance', 'Google Pagespeed'),
	(2, 'SSLLabsGrade', 'This server is vulnverable to attack', null, 66, 'Security', 'SSL Labs');

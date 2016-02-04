INSERT IGNORE INTO `properties` (`id`, `name`, `concerning_text`, `reassuring_text`, `minimum`, `maximum`, `category`, `provider`, `better_than_ft`, `worse_than_ft`, `better_than_competitor`, `worse_than_competitor`, `better`)
VALUES
	(1, 'PageSpeedInsightsScore', 'This page is slow', 'This page is fast', 60, 100, 'Performance', 'Google Pagespeed', 'Fast for the FT', 'Slow for the FT', 'Faster than', 'Slower than', 'increasing'),
	(2, 'SSLLabsGrade', 'This server is vulnverable to attack', 'This server is secure', null, 2, 'Security', 'SSL Labs', null, null, null, null, null);
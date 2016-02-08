INSERT IGNORE INTO `properties` (`name`, `concerning_text`, `reassuring_text`, `minimum`, `maximum`, `category`, `provider`, `better_than_ft`, `worse_than_ft`, `better_than_competitor`, `worse_than_competitor`, `better`)
VALUES
	('PageSpeedInsightsScore', 'This page is slow', 'This page is fast', 60, 100, 'Performance', 'Google Pagespeed', 'Fast for the FT', 'Slow for the FT', 'Faster than', 'Slower than', 'increasing'),
	('NumberOfHosts', 'This page uses too many third-parties', 'This page uses no third-parties', 0, 0, 'Performance', 'Google Pagespeed', 'Fewer third-party requests than FT other products', 'More third-party requests than other FT products', 'Fewer than', 'More than', 'decreasing'),
	('NumberOfResources', 'This page makes too many requests', 'This page makes few requests', null, 10, 'Performance', 'Google Pagespeed', 'Fewer requests than the FT', 'More requests than the FT', 'Fewer than', 'More than', 'decreasing'),
	('WeightOfResources', 'This page is heavy', 'This page is light', null, 10000, 'Performance', 'Google Pagespeed', 'Light for the FT', 'Heavy for the FT', 'Lighter than', 'Heavier than', 'decreasing'),
	('SSLLabsGrade', 'This server is vulnverable to attack', 'This server is secure', null, 2, 'Security', 'SSL Labs', null, null, null, null, null);

	


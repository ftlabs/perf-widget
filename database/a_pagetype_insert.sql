INSERT IGNORE INTO `pagetype` (`type`, `pattern`)
VALUES
	('article','(^https?:\\/\\/next.ft.com\\/content\\/.*)|(^https?:\\/\\/app.ft.com\\/cms\\/s\\/[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}.html)'),
	('homepage','(^https?:\\/\\/next.ft.com\\/(international|uk))|(^https?:\\/\\/app.ft.com\\/index_page\\/home)'),
	('stream','(^https?:\\/\\/next.ft.com\\/stream\\/.*)|(^https?:\\/\\/app.ft.com\\/stream\\/(organisationsId|topicsId)\\/.*'),
	('video','(^https?:\\/\\/video.ft.com\\/?.*)');

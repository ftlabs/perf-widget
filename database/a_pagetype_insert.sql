INSERT IGNORE INTO `pagetype` (`type`, `pattern`)
VALUES
	('article','(^https?:\\/\\/next.ft.com\\/content\\/.*)|(^https?:\\/\\/app.ft.com\\/(cms|content)\\/.*)'),
	('homepage','(^https?:\\/\\/next.ft.com\\/(international|uk))|(^https?:\\/\\/app.ft.com\\/(index_page\\/home|home))'),
	('stream','(^https?:\\/\\/next.ft.com\\/stream\\/.*)|(^https?:\\/\\/app.ft.com\\/(stream|topic)\\/.*)'),
	('video','(^https?:\\/\\/video.ft.com\\/?.*)');

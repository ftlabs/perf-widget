INSERT IGNORE INTO `pagetype` (`type`, `pattern`)
VALUES
	('article','(^https:\\/\\/next.ft.com\\/content\\/.*)'),
	('homepage','(^https:\\/\\/next.ft.com\\/(international|uk))'),
	('stream','(^https:\\/\\/next.ft.com\\/stream\\/.*)'),
	('video','(^https?:\\/\\/video.ft.com\\/.*)');

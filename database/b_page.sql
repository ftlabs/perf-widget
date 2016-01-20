CREATE TABLE IF NOT EXISTS `page` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(2000) NOT NULL DEFAULT '',
  `title` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

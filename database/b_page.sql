CREATE TABLE IF NOT EXISTS `page` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(2000) NOT NULL DEFAULT '',
  `type` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `pagetype_page` (`type`),
  CONSTRAINT `pagetype_page` FOREIGN KEY (`type`) REFERENCES `pagetype` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `properties` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(1000) NOT NULL DEFAULT '',
  `minimum` int(11) DEFAULT NULL,
  `maximum` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

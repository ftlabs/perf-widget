CREATE TABLE IF NOT EXISTS `properties` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `concerning_text` varchar(1000) NOT NULL,
  `reassuring_text` varchar(1000) NOT NULL,
  `minimum` int(11) DEFAULT NULL,
  `maximum` int(11) DEFAULT NULL,
  `category` varchar(1000) NOT NULL,
  `provider` varchar(1000) NOT NULL,
  `better_than_competitor` varchar(1000) NOT NULL,
  `worse_than_competitor` varchar(1000) NOT NULL,
  `better_than_ft` varchar(1000) NOT NULL,
  `worse_than_ft` varchar(1000) NOT NULL,
  `better` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

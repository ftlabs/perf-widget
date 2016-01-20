CREATE TABLE IF NOT EXISTS `pagetype` (
  `type` varchar(20) NOT NULL DEFAULT '',
  `pattern` varchar(2000) NOT NULL DEFAULT '',
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

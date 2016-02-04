CREATE TABLE IF NOT EXISTS `value_history` (
  `property_id` int(11) unsigned NOT NULL,
  `page_id` int(11) unsigned NOT NULL,
  `date` int(20) NOT NULL,
  `value` int(100),
  `link` varchar(1000),
  KEY `property_value_history` (`property_id`),
  KEY `page_value_history` (`page_id`),
  CONSTRAINT `page_value_history` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `property_value_history` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

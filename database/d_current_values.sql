CREATE TABLE IF NOT EXISTS `current_values` (
  `property_id` int(11) unsigned NOT NULL,
  `page_id` int(11) unsigned NOT NULL,
  `date` bigint(20) NOT NULL,
  `value` int(100),
  `link` varchar(1000),
  KEY `page_current_values` (`page_id`),
  KEY `property_current_values` (`property_id`),
  CONSTRAINT `page_current_values` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`),
  CONSTRAINT `property_current_values` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

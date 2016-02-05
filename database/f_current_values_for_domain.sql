CREATE TABLE `current_values_for_domain` (
  `property_id` int(11) unsigned NOT NULL,
  `domain` varchar(1000) NOT NULL,
  `value` int(100),
  KEY `property_current_values_for_domain` (`property_id`),
  CONSTRAINT `property_current_values_for_domain` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
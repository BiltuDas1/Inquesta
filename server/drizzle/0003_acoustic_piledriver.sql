CREATE TABLE `countries` (
	`code` smallint unsigned NOT NULL,
	`name` varchar(100) NOT NULL,
	`iso_code` char(2) NOT NULL,
	`currency_code` char(3) NOT NULL,
	CONSTRAINT `countries_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `users_info` (
	`users_id` varchar(36) NOT NULL,
	`phone_number_cc` smallint unsigned,
	`phone_number` varchar(10),
	`whatsapp_number_cc` smallint unsigned,
	`whatsapp_number` varchar(10),
	`qualification` varchar(255),
	CONSTRAINT `users_info_users_id` PRIMARY KEY(`users_id`)
);
--> statement-breakpoint
ALTER TABLE `users_info` ADD CONSTRAINT `users_info_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
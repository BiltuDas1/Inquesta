CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`firstname` varchar(255) NOT NULL,
	`lastname` varchar(255),
	`email` varchar(320) NOT NULL,
	`password` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);

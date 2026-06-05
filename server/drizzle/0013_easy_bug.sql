CREATE TABLE `teachers_info` (
	`users_id` varchar(36) NOT NULL,
	`qualification` varchar(255),
	CONSTRAINT `teachers_info_users_id` PRIMARY KEY(`users_id`)
);
--> statement-breakpoint
ALTER TABLE `teachers_info` ADD CONSTRAINT `teachers_info_users_id_users_id_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
CREATE TABLE `cart` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courses_id` varchar(36),
	`user_id` varchar(36),
	`added_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cart_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cart` ADD CONSTRAINT `cart_courses_id_courses_id_fk` FOREIGN KEY (`courses_id`) REFERENCES `courses`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart` ADD CONSTRAINT `cart_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
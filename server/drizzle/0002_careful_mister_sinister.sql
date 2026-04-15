CREATE TABLE `courses` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`level` enum('beginner','intermediate','advanced') NOT NULL,
	`duration` varchar(255) NOT NULL,
	`instructor_name` varchar(255) NOT NULL,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `active_status_idx` ON `users` (`is_active`);
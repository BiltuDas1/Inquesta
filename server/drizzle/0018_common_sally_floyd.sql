CREATE TABLE `timetable_entries` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`day` varchar(50) NOT NULL,
	`start_hour` int NOT NULL,
	`duration_hours` int NOT NULL DEFAULT 1,
	`room` varchar(255),
	`color_class` varchar(255),
	`event_type` varchar(50),
	CONSTRAINT `timetable_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `timetable_entries` ADD CONSTRAINT `timetable_entries_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
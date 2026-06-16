CREATE TABLE `attendance` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`date` varchar(10) NOT NULL,
	`status` varchar(20) NOT NULL,
	`marked_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
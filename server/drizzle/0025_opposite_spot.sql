CREATE TABLE `course_resources` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36),
	`title` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `course_resources` ADD CONSTRAINT `course_resources_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;
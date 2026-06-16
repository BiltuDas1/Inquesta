CREATE TABLE `course_takeaways` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`takeaway` text NOT NULL,
	CONSTRAINT `course_takeaways_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `curriculum_units` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`completed` boolean NOT NULL DEFAULT false,
	CONSTRAINT `curriculum_units_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `course_takeaways` ADD CONSTRAINT `course_takeaways_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `curriculum_units` ADD CONSTRAINT `curriculum_units_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;
CREATE TABLE `course_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courses_id` varchar(36),
	`user_id` varchar(36),
	`transaction_id` varchar(255) NOT NULL,
	`enrolled_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_enrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_enrollments_transaction_id_unique` UNIQUE(`transaction_id`)
);
--> statement-breakpoint
ALTER TABLE `course_enrollments` ADD CONSTRAINT `course_enrollments_courses_id_courses_id_fk` FOREIGN KEY (`courses_id`) REFERENCES `courses`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_enrollments` ADD CONSTRAINT `course_enrollments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
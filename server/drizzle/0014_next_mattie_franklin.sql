ALTER TABLE `users` MODIFY COLUMN `role` varchar(255) NOT NULL DEFAULT 'student';--> statement-breakpoint
ALTER TABLE `courses` ADD `teacher_id` varchar(36);--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_teacher_id_users_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
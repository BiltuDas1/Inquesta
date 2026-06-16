ALTER TABLE `course_enrollments` ADD `status` enum('pending','verified','rejected') DEFAULT 'verified' NOT NULL;
--> statement-breakpoint
ALTER TABLE `course_enrollments` ALTER COLUMN `status` SET DEFAULT 'pending';
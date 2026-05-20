ALTER TABLE `courses` ADD `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_slug_unique` UNIQUE(`slug`);
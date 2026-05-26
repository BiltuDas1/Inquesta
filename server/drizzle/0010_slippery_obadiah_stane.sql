CREATE TABLE `filterSettings` (
	`key` varchar(50) NOT NULL,
	`value` text,
	CONSTRAINT `filterSettings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `grades_id` PRIMARY KEY(`id`),
	CONSTRAINT `grades_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `levels` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `levels_id` PRIMARY KEY(`id`),
	CONSTRAINT `levels_name_unique` UNIQUE(`name`)
);

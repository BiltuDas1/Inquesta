CREATE TABLE `notices` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`badge` varchar(255),
	`image_path` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT false,
	CONSTRAINT `notices_id` PRIMARY KEY(`id`)
);

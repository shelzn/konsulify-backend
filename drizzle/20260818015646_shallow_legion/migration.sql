CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`booking_code` varchar(40) NOT NULL,
	`user_id` int NOT NULL,
	`consultant_id` int NOT NULL,
	`service_id` int NOT NULL,
	`schedule_id` int NOT NULL,
	`consultation_date` date NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`customer_name` varchar(120) NOT NULL,
	`customer_phone` varchar(30) NOT NULL,
	`complaint` text NOT NULL,
	`notes` text,
	`price` decimal(12,2) NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booking_code_unique` UNIQUE INDEX(`booking_code`),
	CONSTRAINT `bookings_schedule_id_unique` UNIQUE INDEX(`schedule_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(120) NOT NULL,
	`slug` varchar(140) NOT NULL,
	`description` text,
	`image` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slug_unique` UNIQUE INDEX(`slug`)
);
--> statement-breakpoint
CREATE TABLE `consultants` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`category_id` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`title` varchar(80),
	`email` varchar(160),
	`phone` varchar(30),
	`specialization` varchar(160) NOT NULL,
	`experience_years` int NOT NULL DEFAULT 0,
	`description` text,
	`photo` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`consultant_id` int NOT NULL,
	`date` date NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`status` enum('available','booked','unavailable') NOT NULL DEFAULT 'available',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`consultant_id` int NOT NULL,
	`name` varchar(140) NOT NULL,
	`description` text,
	`duration_minutes` int NOT NULL,
	`price` decimal(12,2) NOT NULL,
	`image` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(120) NOT NULL,
	`email` varchar(160) NOT NULL,
	`phone` varchar(30),
	`password` varchar(255) NOT NULL,
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`avatar` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`user_id` int NOT NULL,
	`token` varchar(160) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `token_unique` UNIQUE INDEX(`token`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_users_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_consultant_id_consultants_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `consultants`(`id`);--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_service_id_services_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`);--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_schedule_id_schedules_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`);--> statement-breakpoint
ALTER TABLE `consultants` ADD CONSTRAINT `consultants_category_id_categories_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`);--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_consultant_id_consultants_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `consultants`(`id`);--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_consultant_id_consultants_id_fkey` FOREIGN KEY (`consultant_id`) REFERENCES `consultants`(`id`);--> statement-breakpoint
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_user_id_users_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
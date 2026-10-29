CREATE TABLE `app_state` (
	`id` text PRIMARY KEY NOT NULL,
	`json` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`last_command` text
);
--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`actor` text NOT NULL,
	`time` text NOT NULL,
	`action` text NOT NULL,
	`result` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audit_events_request_id_unique` ON `audit_events` (`request_id`);--> statement-breakpoint
CREATE TABLE `draft_records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`json` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`team` text NOT NULL,
	`roles` text NOT NULL,
	`owner` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stored_files` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`object_key` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`size` integer NOT NULL,
	`created` text NOT NULL,
	`kind` text NOT NULL
);

CREATE TABLE "CharSheet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"str" integer NOT NULL,
	"dex" integer NOT NULL,
	"will" integer NOT NULL,
	"armor" integer NOT NULL,
	"hp" integer NOT NULL,
	"currency" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" varchar(255)
);

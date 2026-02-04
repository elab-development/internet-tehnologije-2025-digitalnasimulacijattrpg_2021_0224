CREATE TYPE "public"."filetype" AS ENUM('pdf', 'png', 'jpeg');--> statement-breakpoint
CREATE TABLE "Document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "filetype" NOT NULL,
	"filepath" varchar(255) NOT NULL
);

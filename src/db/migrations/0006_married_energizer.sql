CREATE TABLE "campaignDocuments" (
	"capmaign" uuid NOT NULL,
	"document" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campainPlayers" (
	"capmaign" uuid NOT NULL,
	"player" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Note" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Campaign" ADD COLUMN "gameMaster" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "CharSheet" ADD COLUMN "owner" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "Note" ADD COLUMN "writtenIn" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "campaignDocuments" ADD CONSTRAINT "campaignDocuments_capmaign_Campaign_id_fk" FOREIGN KEY ("capmaign") REFERENCES "public"."Campaign"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaignDocuments" ADD CONSTRAINT "campaignDocuments_document_Document_id_fk" FOREIGN KEY ("document") REFERENCES "public"."Document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campainPlayers" ADD CONSTRAINT "campainPlayers_capmaign_Campaign_id_fk" FOREIGN KEY ("capmaign") REFERENCES "public"."Campaign"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campainPlayers" ADD CONSTRAINT "campainPlayers_player_User_id_fk" FOREIGN KEY ("player") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_gameMaster_User_id_fk" FOREIGN KEY ("gameMaster") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharSheet" ADD CONSTRAINT "CharSheet_owner_User_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Note" ADD CONSTRAINT "Note_writtenIn_CharSheet_id_fk" FOREIGN KEY ("writtenIn") REFERENCES "public"."CharSheet"("id") ON DELETE no action ON UPDATE no action;
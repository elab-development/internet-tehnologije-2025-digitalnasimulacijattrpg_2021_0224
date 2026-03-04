CREATE TABLE "campaignPlayersCharSheets" (
	"campaign" uuid NOT NULL,
	"player" uuid NOT NULL,
	"charSheet" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaignPlayersCharSheets" ADD CONSTRAINT "campaignPlayersCharSheets_campaign_Campaign_id_fk" FOREIGN KEY ("campaign") REFERENCES "public"."Campaign"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaignPlayersCharSheets" ADD CONSTRAINT "campaignPlayersCharSheets_player_User_id_fk" FOREIGN KEY ("player") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaignPlayersCharSheets" ADD CONSTRAINT "campaignPlayersCharSheets_charSheet_CharSheet_id_fk" FOREIGN KEY ("charSheet") REFERENCES "public"."CharSheet"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "country_rankings" (
	"country_id" text PRIMARY KEY NOT NULL,
	"elo_change" integer NOT NULL,
	"elo_rating" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

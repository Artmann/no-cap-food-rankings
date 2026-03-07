CREATE TABLE "votes" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"non_preferred_country_id" text NOT NULL,
	"preferred_country_id" text NOT NULL,
	"visitor_id" uuid NOT NULL
);

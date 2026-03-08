alter table "public"."events" add column "conditions" text default 'Clean • Light Offshore'::text;

alter table "public"."events" add column "swell_height" text default '6-8ft'::text;

alter table "public"."events" add column "swell_status" text;



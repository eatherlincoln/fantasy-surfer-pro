SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict a4JxcozdQivJKfh6ddHJQtcae51CYMiFEDIgdU4bRYBnubT1H4jSVa20orRoBij

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'd0d77bb3-6d51-4582-ac60-a6bcfc187701', 'authenticated', 'authenticated', 'lincolneather@icloud.com', '$2a$10$AatgtQOkrSugbkcalBvFb.zjvw1lOukRnvQfTnRO7UlGTL2to4arm', '2026-01-03 06:09:04.102579+00', NULL, '', '2026-01-03 06:08:54.64701+00', '', NULL, '', '', NULL, '2026-01-03 06:09:04.106743+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d0d77bb3-6d51-4582-ac60-a6bcfc187701", "email": "lincolneather@icloud.com", "email_verified": true, "phone_verified": false}', NULL, '2026-01-03 06:08:54.640182+00', '2026-01-03 06:09:04.110888+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0d13bdba-6d70-4807-b34f-f0a707cdb232', 'authenticated', 'authenticated', 'tim@timhawken.com', '$2a$10$jdBmPVJEzbc/4gWI/j8jV.RU1wyZxaamnC.vsiKjX4dUqZ36HW1vS', NULL, NULL, 'd9768bce588324742aeb4dd16809f28ada51972b4d4587f645a21757', '2026-01-01 06:35:03.025621+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "0d13bdba-6d70-4807-b34f-f0a707cdb232", "email": "tim@timhawken.com", "email_verified": false, "phone_verified": false}', NULL, '2026-01-01 06:35:03.005284+00', '2026-01-01 06:35:06.011307+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '89b505a1-eb2b-4427-b5d2-a98c77277ed2', 'authenticated', 'authenticated', 'mikwargent@me.com', '$2a$10$ijiHObZER1.Ks13WkCY6XeOmVR3mGNLKH080eQ1.fjgpwX8FVRmlu', NULL, NULL, 'a209c5ad01306d52600fb90610ee46d375f4aac03cc9a9eecc2f92d9', '2026-01-08 04:20:58.27748+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "89b505a1-eb2b-4427-b5d2-a98c77277ed2", "email": "mikwargent@me.com", "email_verified": false, "phone_verified": false}', NULL, '2026-01-08 04:20:58.261365+00', '2026-01-08 04:21:01.548142+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '11961dcb-20de-4b23-846f-a1a1567baa43', 'authenticated', 'authenticated', 'lincolneather@me.com', '$2a$10$osO9hReKMmxtsuoHNQLe3O4hUJn8ykA6pro5qQhCFwY6WV.COFh3S', '2026-01-03 06:05:02.245654+00', NULL, '', '2026-01-03 06:04:45.614751+00', '', NULL, '', '', NULL, '2026-01-03 06:05:02.249875+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "11961dcb-20de-4b23-846f-a1a1567baa43", "email": "lincolneather@me.com", "email_verified": true, "phone_verified": false}', NULL, '2026-01-03 06:04:45.605643+00', '2026-01-03 06:05:02.261514+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'eea34a1b-85d6-4071-b541-1c983de9fd6a', 'authenticated', 'authenticated', 'rdart@kane.com.au', '$2a$10$d4fGSF8FaAZTi2H85pMnfOfYfKYb62pbntez49.IODFD7fhgzdyuu', '2026-01-03 06:38:27.255183+00', NULL, '', '2026-01-03 06:38:07.868097+00', '', NULL, '', '', NULL, '2026-01-03 06:38:27.258948+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "eea34a1b-85d6-4071-b541-1c983de9fd6a", "email": "rdart@kane.com.au", "email_verified": true, "phone_verified": false}', NULL, '2026-01-03 06:38:07.860899+00', '2026-01-03 06:38:27.26218+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7a3e6d80-1348-49da-ac04-e8991096b319', 'authenticated', 'authenticated', 'lincoln@thisisneverwork.com', '$2a$10$ty0dNB5ixvz0sx.XQ1jblu497PoqGi5/1ZVUVvpTGCj4TvNKrkliC', '2026-01-03 06:16:10.329849+00', NULL, '', '2026-01-03 06:15:09.246775+00', '', NULL, '', '', NULL, '2026-01-03 06:16:10.333979+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "7a3e6d80-1348-49da-ac04-e8991096b319", "email": "lincoln@thisisneverwork.com", "email_verified": true, "phone_verified": false}', NULL, '2026-01-03 06:15:09.240085+00', '2026-03-08 21:22:41.070455+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('0d13bdba-6d70-4807-b34f-f0a707cdb232', '0d13bdba-6d70-4807-b34f-f0a707cdb232', '{"sub": "0d13bdba-6d70-4807-b34f-f0a707cdb232", "email": "tim@timhawken.com", "email_verified": false, "phone_verified": false}', 'email', '2026-01-01 06:35:03.021932+00', '2026-01-01 06:35:03.021993+00', '2026-01-01 06:35:03.021993+00', '17542044-c0ed-4666-beda-872c0f86bce8'),
	('11961dcb-20de-4b23-846f-a1a1567baa43', '11961dcb-20de-4b23-846f-a1a1567baa43', '{"sub": "11961dcb-20de-4b23-846f-a1a1567baa43", "email": "lincolneather@me.com", "email_verified": true, "phone_verified": false}', 'email', '2026-01-03 06:04:45.611682+00', '2026-01-03 06:04:45.611735+00', '2026-01-03 06:04:45.611735+00', 'f1553364-a0e9-4408-8c04-25666f30b602'),
	('d0d77bb3-6d51-4582-ac60-a6bcfc187701', 'd0d77bb3-6d51-4582-ac60-a6bcfc187701', '{"sub": "d0d77bb3-6d51-4582-ac60-a6bcfc187701", "email": "lincolneather@icloud.com", "email_verified": true, "phone_verified": false}', 'email', '2026-01-03 06:08:54.644113+00', '2026-01-03 06:08:54.644172+00', '2026-01-03 06:08:54.644172+00', '0b5d5245-1790-43d6-a234-b6bf43a8db24'),
	('7a3e6d80-1348-49da-ac04-e8991096b319', '7a3e6d80-1348-49da-ac04-e8991096b319', '{"sub": "7a3e6d80-1348-49da-ac04-e8991096b319", "email": "lincoln@thisisneverwork.com", "email_verified": true, "phone_verified": false}', 'email', '2026-01-03 06:15:09.243838+00', '2026-01-03 06:15:09.243886+00', '2026-01-03 06:15:09.243886+00', '97c54235-acab-4306-a0aa-8be06e4b2ec3'),
	('eea34a1b-85d6-4071-b541-1c983de9fd6a', 'eea34a1b-85d6-4071-b541-1c983de9fd6a', '{"sub": "eea34a1b-85d6-4071-b541-1c983de9fd6a", "email": "rdart@kane.com.au", "email_verified": true, "phone_verified": false}', 'email', '2026-01-03 06:38:07.865041+00', '2026-01-03 06:38:07.865104+00', '2026-01-03 06:38:07.865104+00', 'a7187399-24c1-4879-9b2e-214ded069b70'),
	('89b505a1-eb2b-4427-b5d2-a98c77277ed2', '89b505a1-eb2b-4427-b5d2-a98c77277ed2', '{"sub": "89b505a1-eb2b-4427-b5d2-a98c77277ed2", "email": "mikwargent@me.com", "email_verified": false, "phone_verified": false}', 'email', '2026-01-08 04:20:58.272634+00', '2026-01-08 04:20:58.272687+00', '2026-01-08 04:20:58.272687+00', '19c62c80-0c76-487e-b253-17b621256709');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('92907b91-d836-48db-a145-4108e9fd7e0a', '11961dcb-20de-4b23-846f-a1a1567baa43', '2026-01-03 06:05:02.250008+00', '2026-01-03 06:05:02.250008+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '180.233.125.190', NULL, NULL, NULL, NULL, NULL),
	('052b7e56-5afc-44cb-b124-76b23fcd6423', 'd0d77bb3-6d51-4582-ac60-a6bcfc187701', '2026-01-03 06:09:04.106874+00', '2026-01-03 06:09:04.106874+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '180.233.125.190', NULL, NULL, NULL, NULL, NULL),
	('af0db1d0-1ab7-4349-bcee-ef3abb38280a', 'eea34a1b-85d6-4071-b541-1c983de9fd6a', '2026-01-03 06:38:27.259053+00', '2026-01-03 06:38:27.259053+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '13.221.19.163', NULL, NULL, NULL, NULL, NULL),
	('30f46045-2d6a-4972-8874-d6071e9667a6', '7a3e6d80-1348-49da-ac04-e8991096b319', '2026-01-03 06:16:10.334071+00', '2026-03-08 21:22:41.07571+00', NULL, 'aal1', NULL, '2026-03-08 21:22:41.075578', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '180.233.125.157', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('92907b91-d836-48db-a145-4108e9fd7e0a', '2026-01-03 06:05:02.262215+00', '2026-01-03 06:05:02.262215+00', 'otp', 'd9c6740f-50cd-4ba4-9695-1911b5295e24'),
	('052b7e56-5afc-44cb-b124-76b23fcd6423', '2026-01-03 06:09:04.111439+00', '2026-01-03 06:09:04.111439+00', 'otp', 'e381b692-9af3-4a18-bec6-ea3d03de54e6'),
	('30f46045-2d6a-4972-8874-d6071e9667a6', '2026-01-03 06:16:10.3375+00', '2026-01-03 06:16:10.3375+00', 'otp', 'a0259c51-0fda-4c0d-ba80-eb28e1733b1c'),
	('af0db1d0-1ab7-4349-bcee-ef3abb38280a', '2026-01-03 06:38:27.262721+00', '2026-01-03 06:38:27.262721+00', 'otp', '3d70d0da-76a3-4649-ac90-a157c21b193b');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('3fa1d655-adb9-4aa1-8337-060aa3c6d648', '0d13bdba-6d70-4807-b34f-f0a707cdb232', 'confirmation_token', 'd9768bce588324742aeb4dd16809f28ada51972b4d4587f645a21757', 'tim@timhawken.com', '2026-01-01 06:35:06.016214', '2026-01-01 06:35:06.016214'),
	('5e47d0c3-2a86-4315-b753-b2963bcb2c8a', '89b505a1-eb2b-4427-b5d2-a98c77277ed2', 'confirmation_token', 'a209c5ad01306d52600fb90610ee46d375f4aac03cc9a9eecc2f92d9', 'mikwargent@me.com', '2026-01-08 04:21:01.552801', '2026-01-08 04:21:01.552801');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'i42dmeco5znk', '11961dcb-20de-4b23-846f-a1a1567baa43', false, '2026-01-03 06:05:02.255003+00', '2026-01-03 06:05:02.255003+00', NULL, '92907b91-d836-48db-a145-4108e9fd7e0a'),
	('00000000-0000-0000-0000-000000000000', 2, '23crvzhykgab', 'd0d77bb3-6d51-4582-ac60-a6bcfc187701', false, '2026-01-03 06:09:04.108421+00', '2026-01-03 06:09:04.108421+00', NULL, '052b7e56-5afc-44cb-b124-76b23fcd6423'),
	('00000000-0000-0000-0000-000000000000', 4, 'odieqi2hb6vb', 'eea34a1b-85d6-4071-b541-1c983de9fd6a', false, '2026-01-03 06:38:27.260601+00', '2026-01-03 06:38:27.260601+00', NULL, 'af0db1d0-1ab7-4349-bcee-ef3abb38280a'),
	('00000000-0000-0000-0000-000000000000', 3, '3xssgk4mult2', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-03 06:16:10.335515+00', '2026-01-03 08:12:41.481698+00', NULL, '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 5, 'gyr2z3yzq6ge', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-03 08:12:41.482776+00', '2026-01-03 10:00:22.806466+00', '3xssgk4mult2', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 6, 'bvvmsgovt45w', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-03 10:00:22.807208+00', '2026-01-03 22:46:33.089658+00', 'gyr2z3yzq6ge', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 7, 'gfvcedr4lpro', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-03 22:46:33.091438+00', '2026-01-04 00:45:41.787794+00', 'bvvmsgovt45w', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 8, '6kc4xps3ipl4', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 00:45:41.788847+00', '2026-01-04 02:15:41.466302+00', 'gfvcedr4lpro', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 9, 'hqw7k6p4gtlg', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 02:15:41.467404+00', '2026-01-04 03:14:10.945843+00', '6kc4xps3ipl4', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 10, 'snxokycxlvay', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 03:14:10.946997+00', '2026-01-04 04:12:33.145449+00', 'hqw7k6p4gtlg', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 11, 'ekmjlafrcdar', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 04:12:33.146312+00', '2026-01-04 05:18:51.399184+00', 'snxokycxlvay', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 12, '6apvtudr7vcx', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 05:18:51.400389+00', '2026-01-04 06:17:21.256142+00', 'ekmjlafrcdar', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 13, 'p5sgpeut6nph', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 06:17:21.256923+00', '2026-01-04 07:18:53.874367+00', '6apvtudr7vcx', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 14, 'r4otqocflazt', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 07:18:53.875229+00', '2026-01-04 08:30:47.571484+00', 'p5sgpeut6nph', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 15, 'z5jaxbxhu6oe', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 08:30:47.573031+00', '2026-01-04 09:54:29.739992+00', 'r4otqocflazt', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 16, 'cw3ut5bv5dc5', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 09:54:29.740732+00', '2026-01-04 10:53:54.825435+00', 'z5jaxbxhu6oe', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 17, 'g6dbiiu45s73', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-04 10:53:54.826679+00', '2026-01-05 00:30:33.08601+00', 'cw3ut5bv5dc5', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 18, 'ebe27fwvc5cy', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 00:30:33.087257+00', '2026-01-05 10:16:55.222209+00', 'g6dbiiu45s73', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 19, '4rrspckyxe56', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 10:16:55.223203+00', '2026-01-05 11:15:04.867221+00', 'ebe27fwvc5cy', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 20, 'i7l7l3bzcene', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 11:15:04.868215+00', '2026-01-05 12:13:04.869597+00', '4rrspckyxe56', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 21, 'yfkyz2aosoes', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 12:13:04.870448+00', '2026-01-05 13:11:04.838919+00', 'i7l7l3bzcene', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 22, 'fh4eke4ejbgs', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 13:11:04.839671+00', '2026-01-05 14:09:04.860323+00', 'yfkyz2aosoes', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 23, 'yfb74abm7gvi', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 14:09:04.861182+00', '2026-01-05 15:07:04.824261+00', 'fh4eke4ejbgs', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 24, 'ktd3s3xqkfra', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 15:07:04.825343+00', '2026-01-05 16:05:04.855893+00', 'yfb74abm7gvi', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 25, 'agkaddgla3zw', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 16:05:04.856674+00', '2026-01-05 17:03:04.807139+00', 'ktd3s3xqkfra', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 26, 'bwnjyc3vndhc', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 17:03:04.80819+00', '2026-01-05 18:01:04.810407+00', 'agkaddgla3zw', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 27, 'd7r4jrlqayon', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 18:01:04.811174+00', '2026-01-05 18:59:23.279433+00', 'bwnjyc3vndhc', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 28, 'l57wqk7deot5', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 18:59:23.280554+00', '2026-01-05 19:57:53.321854+00', 'd7r4jrlqayon', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 29, 'z5sytylrbjy6', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-05 19:57:53.322616+00', '2026-01-06 04:24:06.430269+00', 'l57wqk7deot5', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 30, 'aygch6a4tzr2', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-01-06 04:24:06.431402+00', '2026-02-26 00:00:49.975872+00', 'z5sytylrbjy6', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 31, 'u4wk72n7wqua', '7a3e6d80-1348-49da-ac04-e8991096b319', true, '2026-02-26 00:00:49.990007+00', '2026-03-08 21:22:41.057756+00', 'aygch6a4tzr2', '30f46045-2d6a-4972-8874-d6071e9667a6'),
	('00000000-0000-0000-0000-000000000000', 32, 'ucfzcyy2jabt', '7a3e6d80-1348-49da-ac04-e8991096b319', false, '2026-03-08 21:22:41.065505+00', '2026-03-08 21:22:41.065505+00', 'u4wk72n7wqua', '30f46045-2d6a-4972-8874-d6071e9667a6');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."events" ("id", "created_at", "name", "slug", "status", "start_date", "end_date", "header_image", "ai_context", "is_current", "conditions", "swell_height", "swell_status") VALUES
	('81bcf839-162d-4d7a-a4c1-3b0edf30e68b', '2026-03-08 21:32:58.068296+00', 'Bioglan Newcastle Surfest Pro', 'newcastle-surfest', 'UPCOMING', '2026-03-08 21:32:57.979+00', '2026-03-08 21:32:57.979+00', 'https://placehold.co/1200x400/0055aa/ffffff?text=Event+Header', NULL, false, 'Clean • Light Offshore', '6-8ft', NULL);


--
-- Data for Name: heats; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: surfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."surfers" ("id", "name", "country", "flag", "stance", "age", "value", "tier", "image", "created_at", "status", "current_season_points", "gender", "is_on_tour") VALUES
	('633dce4d-2a7c-4a46-9c2f-b4844d0c45d6', 'Yago Dora', 'BRA', '🇧🇷', 'Goofy', 27, 4.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/c97a7e74e_Yago-Dora.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('164ecabd-9277-4309-8e5e-580a484e8ef4', 'John John Florence', 'HAW', '🇺🇸', 'Regular', 31, 10.0, 'A', '/images/surfers/john_john_florence.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('d2578f2c-6883-4208-9acb-2ac9338b8c12', 'Kauli Vaast', 'FRA', '🇫🇷', 'Regular', NULL, 5, 'C', 'https://ui-avatars.com/api/?name=Kauli%20Vaast&background=random', '2026-01-04 07:19:21.467286+00', 'ACTIVE', 0, 'Male', true),
	('eb984193-fcb6-4432-b32b-d2494a177a34', 'Mihimana Braye', 'FRA', '🇫🇷', 'Regular', NULL, 5, 'C', 'https://ui-avatars.com/api/?name=Mihimana%20Braye&background=random', '2026-01-04 07:20:05.936185+00', 'ACTIVE', 0, 'Male', true),
	('eebbe009-4fc4-4360-90b1-4c9c2053b8bf', 'Teiva Tairoa', 'FRA', '🇫🇷', 'Regular', NULL, 5, 'C', 'https://ui-avatars.com/api/?name=Teiva%20Tairoa&background=random', '2026-01-04 07:20:18.589106+00', 'ACTIVE', 0, 'Male', true),
	('afab0d0a-9297-4418-b519-fcad6a238fd9', 'Ethan Ewing', 'AUS', '🇦🇺', 'Regular', 25, 8.5, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/53aa937f5_Ethan-Ewing.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('52a3bdc4-aeec-47ec-bc68-5c6023b9cb88', 'Griffin Colapinto', 'USA', '🇺🇸', 'Regular', 25, 9.5, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/0e6877764_Griffin-Colapinto.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('a4603a2e-5519-43a4-9f64-c6321e1bc093', 'Kelly Slater', 'USA', '🇺🇸', 'Regular', 52, 5.0, 'C', 'https://ui-avatars.com/api/?name=Kelly+Slater&background=random', '2026-01-04 02:26:25.073224+00', 'ACTIVE', 0, 'Male', false),
	('ac7f900e-466e-4525-844c-3ca712acbb51', 'Hughie Vaughan', 'AUS', '🇦🇺', 'Regular', NULL, 5, 'C', 'https://ui-avatars.com/api/?name=Hughie%20Vaughan&background=random', '2026-01-04 07:36:05.489481+00', 'ACTIVE', 0, 'Male', false),
	('ab5badba-9efb-498b-8d37-0e8d7c58410b', 'Stephanie Gilmore', 'AUS', '🇦🇺', 'Regular', 36, 7.5, 'B', '/images/surfers/stephanie_gilmore.png', '2026-01-04 02:26:25.073224+00', 'ACTIVE', 0, 'Female', true),
	('8cc07408-1ca9-4488-a179-67189116d36b', 'Molly Picklum', 'AUS', '🇦🇺', 'Regular', 21, 11.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/f8218596d_molly-picklum.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('88146dad-8973-4783-8dfc-ddc39d8212d2', 'Jack Robinson', 'AUSTRALIA', '🏳️', 'Regular', 26, 9.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/4f62274f0_Jack-Robinson.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('43ff7b5f-4dcc-473e-939d-3626e97423c6', 'Caitlin Simmers', 'USA', '🇺🇸', 'Regular', 18, 10.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/6cf94906a_caitlyn-simmers.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('f48eb059-5df5-4f9a-b9c2-fe50e55a2922', 'Italo Ferreira', 'BRA', '🇧🇷', 'Goofy', 29, 8.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/3ddea78af_Italo-Ferraria.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('d26eb453-7718-40aa-9f61-11819ca4ef4a', 'Caroline Marks', 'USA', '🇺🇸', 'Goofy', 22, 9.5, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/664d54e46_caroline-marks.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('8dc7f6ad-c415-4b65-9862-ec6c0ddf39ea', 'Gabriel Medina', 'BRA', '🇧🇷', 'Goofy', 30, 7.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/aebc31dff_Gabby-Medina.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('c385a9d6-c6cf-413d-8338-51442526cfde', 'Betty Lou Sakura Johnson', 'HAW', '🇸', 'Regular', 19, 8.0, 'A', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/dfa6b644b_betty-lou-sakura.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('4d24eb98-cda4-42e6-abbe-96b358bf1c50', 'Erin Brooks', 'CAN', '�u0061', 'Goofy', 17, 7.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/5e0fc50ec_erin-brooks.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('cf62eec7-2d80-41a6-a332-de121da42ae4', 'Gabriela Bryan', 'HAW', '��', 'Regular', 22, 6.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/c3a3ce643_gabby-bryant.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('8cc693b1-a65b-45bd-821f-29dfdc2908ba', 'Tyler Wright', 'AUS', '🇦🇺', 'Regular', 29, 6.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/abf499dea_tyler-wright.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('3a17e974-3bad-4f9c-afd8-9bf6ea1d330b', 'Liam O''Brien', 'AUS', '🇦🇺', 'Regular', 24, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/8cf75c02b_Laim-Obrien.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('4cd55d3b-39ad-4616-87e3-129e7391b00f', 'Lakey Peterson', 'USA', '🇺🇸', 'Regular', 29, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/bad52d00a_lakey-peterson.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('be7fbe86-a78e-46db-b91c-d5998a2e91d4', 'Brisa Hennessy', 'CRC', '🇨🇷', 'Regular', 24, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/18462750c_brisa-hennessy.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('451cecff-579e-4b66-92a3-017746b9bf00', 'Matthew McGillivray', 'RSA', '🇿🇦', 'Regular', 26, 4.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/71246df27_Matt-Mcgillvary.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('42f5d4a2-1bcb-4789-9d36-93df7f7a1437', 'Kanoa Igarashi', 'JPN', '🇯🇵', 'Regular', 26, 6.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/552a8cfc5_kanoa-Igarashi.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('b10fab0d-bd26-4baa-b9e0-baf96dac7744', 'Crosby Colapinto', 'USA', '🇺🇸', 'Regular', 22, 3.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/3d429d86a_Crosby-Colapinto.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('d862c937-a485-430e-86e4-1d5af449bbfa', 'Jordy Smith', 'ZAF', '🇿🇦', 'Regular', 36, 7.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/d589c0194_Jordy-Smith.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('79aec28c-61a3-4933-9225-ad49b58557ca', 'Cole Houshmand', 'USA', '🇺🇸', 'Goofy', 23, 6.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/466443c69_Cole-Houshmand.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('b36034bd-2e80-4ffb-9208-937eef9d646c', 'Connor O''Leary', 'JPN', '🇯🇵', 'Goofy', 30, 4.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/8bc34ac4c_Connor-Oleary.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('30f0819b-d0e8-4c3f-a2d0-2b089fb99252', 'Leonardo Fioravanti', 'ITA', '🇮🇹', 'Regular', 26, 5.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/b4e9a0f31_Leo-Fivo.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('315df287-4ad7-4b10-a5b7-d0804331dbb9', 'Joao Chianca', 'BRA', '🇧🇷', 'Regular', NULL, 5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/e5a59113a_Jaoa-Chianca.png', '2026-01-04 07:20:34.843923+00', 'ACTIVE', 0, 'Male', true),
	('f8fa4b7b-11b2-44d3-adfc-42d5abb4aa1a', 'Filipe Toledo', 'BRA', '🇧🇷', 'Regular', NULL, 5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/efc922ebc_Filipe-Toledo.png', '2026-01-04 07:20:45.87651+00', 'ACTIVE', 0, 'Male', true),
	('c6500cce-0fc7-432e-8ae1-03e45d75ffc3', 'Barron Mamiya', 'HAW', '🇺🇸', 'Regular', 24, 6.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/649ca6fb4_Barron-Mamiya.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('f1fa99c3-aab8-4048-8505-31bcffd39160', 'Miguel Pupo', 'BRA', '🇧🇷', 'Regular', NULL, 5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/316c4ab51_Miggy-Pupo.png', '2026-01-04 07:19:10.336297+00', 'ACTIVE', 0, 'Male', true),
	('5208d856-0676-4cbb-92e5-6715683ec28b', 'Jake Marshall', 'USA', '🇺🇸', 'Regular', 25, 6.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/a9c534c51_Jake-Marshall.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('405a5466-3edd-4d51-a94f-61b025abf674', 'Joel Vaughan', 'AUS', '🇦🇺', 'Regular', NULL, 5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/fb635d813_Joel-Vaughan.png', '2026-01-04 07:20:10.980352+00', 'ACTIVE', 0, 'Male', true),
	('65b2b7b7-bc41-4bc4-8d0f-e57d0fc1b6c7', 'Ryan Callinan', 'AUS', '🇦🇺', 'Goofy', 31, 5.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/a76d045f8_Ryan-Callinan.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('35aba300-fa93-4118-aee5-931fbb7af64a', 'Luana Silva', 'BRA', '🇧🇷', 'Regular', 19, 4.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/b91cac22b_luana-silva.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('f9faf3f0-3564-4772-94e1-016473c9e518', 'Sally Fitzgibbons', 'AUS', '🇦🇺', 'Regular', 33, 4.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/52b4ebf42_sally-fitzgibbons.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('276d5ee7-3cf8-4eb9-86a4-0cba95de67d3', 'Imaikalani deVault', 'HAW', '🇺🇸', 'Regular', 26, 4.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/90096d2c3_Imaikalani.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('5110872b-e22e-4888-bce0-7a3726f81fad', 'Isabella Nichols', 'AUS', '��', 'Regular', 26, 4.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/88b56d5e2_isabella-nichols.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('8ffcebf6-9474-46a8-8a1f-29377a1af63d', 'Sawyer Lindblad', 'USA', '🇺🇸', 'Goofy', 18, 4.0, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/f29351216_sawyer-linblad.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('d6cf8d00-37ea-45ee-b8f7-d3e87d99a29c', 'Ramzi Boukhiam', 'MOR', '🇲🇦', 'Goofy', 30, 3.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/60acda1fa_Ramzi-Boukhaim.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('11dfdd1d-3c80-425c-accf-2beb81411626', 'Bella Kenworthy', 'USA', '🇺🇸', 'Regular', 17, 2.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/326cc8f41_bella-kenworthy.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('19c67e11-9c5c-4f1c-ae24-38f99a2fa0e1', 'Johanne Defay', 'FRA', '🇫🇷', 'Regular', 30, 1.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/94b9eedd2_johanne-defay.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('8b8e0126-17fa-46a5-898f-0de7e59e3b43', 'Tatiana Weston-Webb', 'BRA', '🇧🇷', 'Goofy', 27, 1.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/6c42e2917_tatiana-weston-webb.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('4ad67ad7-fd69-44cf-a783-664d9a46ace5', 'Vahine Fierro', 'FRA', '🇫🇷', 'Goofy', 24, 1.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/7e2031507_vahine-fierro.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('d4575488-4239-4a7c-a62b-95876c5ed59f', 'Nadia Erostarbe', 'EUS', '🇪🇸', 'Goofy', 23, 0.5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ce1bb0c05c7a47021428e9/3e8090198_nadia-erostarbe.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('0ab39465-dff8-4c23-8549-35ad2aef22dc', 'Seth Moniz', 'HAW', '🇺🇸', 'Regular', 26, 4.0, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/5c838d264_Seth-Moniz.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('8945196d-eeb7-4c18-bb8d-c654b68a1cf3', 'Rio Waida', 'IDN', '🇮🇩', 'Regular', 24, 5.5, 'B', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/f65c34ae8_Rio-M.png', '2025-12-31 01:42:13.245872+00', 'ACTIVE', 0, NULL, true),
	('4bde3144-1bff-4a48-ab0a-6da97e45b18b', 'Alan Cleland', 'MEX', '🇲🇽', 'Regular', NULL, 5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/346b79f60_Al-Cleland.png', '2026-01-04 07:20:28.086944+00', 'ACTIVE', 0, 'Male', true),
	('67170686-b49b-4937-b9b4-a13c9ee53beb', 'Marco Mignot', 'FRA', '🇫🇷', 'Regular', NULL, 5, 'C', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cd1329092f16fac35385c3/af2d4a5a4_Marco-Mignot.png', '2026-01-04 07:20:51.422421+00', 'ACTIVE', 0, 'Male', true);


--
-- Data for Name: heat_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "username", "avatar_url", "updated_at", "team_name", "full_name", "total_fantasy_points", "is_banned", "is_admin") VALUES
	('7a3e6d80-1348-49da-ac04-e8991096b319', 'EmpireAve', 'https://empireave.com/wp-content/uploads/2018/04/logo-1.jpg', '2026-01-03 06:16:56.868+00', 'EmpireAve', 'Lincoln Eather', 0, false, false);


--
-- Data for Name: leagues; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."leagues" ("id", "name", "created_by", "code", "created_at") VALUES
	('d18571e1-e224-435a-8d0f-1f0197decb44', 'Fantasy or Die', '7a3e6d80-1348-49da-ac04-e8991096b319', 'DY8WFO', '2026-01-04 00:55:12.259111+00'),
	('d8f0f893-b493-4026-bce7-1c8427f452b4', 'Fantasy or Die', '7a3e6d80-1348-49da-ac04-e8991096b319', 'LAPKPJ', '2026-01-04 01:06:37.719566+00');


--
-- Data for Name: league_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."league_members" ("id", "league_id", "user_id", "joined_at", "is_admin") VALUES
	('28320adf-ff87-4ccf-9c26-f7ee779135df', 'd8f0f893-b493-4026-bce7-1c8427f452b4', '7a3e6d80-1348-49da-ac04-e8991096b319', '2026-01-04 01:06:37.782998+00', true);


--
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_teams; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('event-headers', 'event-headers', NULL, '2026-01-04 10:20:06.499016+00', '2026-01-04 10:20:06.499016+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('eb67c258-3496-448b-8cbb-0847fa0084a7', 'event-headers', 'zj8cjg4hw9o.jpg', '7a3e6d80-1348-49da-ac04-e8991096b319', '2026-01-04 10:24:12.435646+00', '2026-01-04 10:24:12.435646+00', '2026-01-04 10:24:12.435646+00', '{"eTag": "\"9e590454f097a464f4c2ebfe04fcdcc0\"", "size": 123505, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-04T10:24:13.000Z", "contentLength": 123505, "httpStatusCode": 200}', '12db51ee-89b5-4b7f-934f-603d7375e94c', '7a3e6d80-1348-49da-ac04-e8991096b319', '{}'),
	('ba0c05e0-fba4-4b7c-b8bc-43a8bf0427aa', 'event-headers', '7usbwivq0d2.jpg', '7a3e6d80-1348-49da-ac04-e8991096b319', '2026-01-04 10:38:30.097494+00', '2026-01-04 10:38:30.097494+00', '2026-01-04 10:38:30.097494+00', '{"eTag": "\"fcc216f6878e8e9b4f483366cbc619ac\"", "size": 81262, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-04T10:38:31.000Z", "contentLength": 81262, "httpStatusCode": 200}', '2a84341c-2d0f-4a47-810e-dcec34edd503', '7a3e6d80-1348-49da-ac04-e8991096b319', '{}'),
	('ba1852df-4837-47dd-bdc0-fbcab40d2715', 'event-headers', 'w0d1b2w3xml.jpg', '7a3e6d80-1348-49da-ac04-e8991096b319', '2026-01-04 10:42:46.685178+00', '2026-01-04 10:42:46.685178+00', '2026-01-04 10:42:46.685178+00', '{"eTag": "\"3dc3a4e67a7bf681fad795ea85f23fd2\"", "size": 118061, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-04T10:42:47.000Z", "contentLength": 118061, "httpStatusCode": 200}', 'c15392f7-e24c-4cbc-91d1-eb6c304acf81', '7a3e6d80-1348-49da-ac04-e8991096b319', '{}'),
	('5182b735-701c-4e63-a651-38b98439f774', 'event-headers', 'tb7o6pm9obn.png', '7a3e6d80-1348-49da-ac04-e8991096b319', '2026-01-05 01:15:07.618725+00', '2026-01-05 01:15:07.618725+00', '2026-01-05 01:15:07.618725+00', '{"eTag": "\"47af13044001d99b1526d887763ece87\"", "size": 1114506, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-05T01:15:08.000Z", "contentLength": 1114506, "httpStatusCode": 200}', '111f1d78-810e-4216-91b0-782b44086de3', '7a3e6d80-1348-49da-ac04-e8991096b319', '{}'),
	('f962dd41-33ec-4be7-b2a6-5cf5bde87689', 'event-headers', 'rlpm6wwufr.png', '7a3e6d80-1348-49da-ac04-e8991096b319', '2026-03-08 21:33:09.340258+00', '2026-03-08 21:33:09.340258+00', '2026-03-08 21:33:09.340258+00', '{"eTag": "\"95c60702a41d17325f91430b31cdd03e\"", "size": 785192, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-03-08T21:33:10.000Z", "contentLength": 785192, "httpStatusCode": 200}', 'ee582c20-a481-497e-b7bf-aa400201bb11', '7a3e6d80-1348-49da-ac04-e8991096b319', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 32, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict a4JxcozdQivJKfh6ddHJQtcae51CYMiFEDIgdU4bRYBnubT1H4jSVa20orRoBij

RESET ALL;

# Database SQL folder

Files in this folder:

- `current_schema.sql` — the original schema snapshot you provided (context only).
- `migration_add_images_website.sql` — ALTER TABLE migration to add `images` (jsonb) and `website_url` to `projects`, plus an RLS policy.
- `seed_default_projects.sql` — three INSERT statements to seed sample projects (Acapolite, Gen Exam, Wisher&Giver).

How to run
1. Open your Supabase project → SQL → New query.
2. Run `migration_add_images_website.sql` to add the new columns and policies.
3. Run `seed_default_projects.sql` to insert sample rows into `projects`.

Notes
- Review and modify the seed file before running if you want different IDs, image paths, or additional fields.
- If your `projects` table already contains data, adjust inserts to avoid primary key conflicts or use `upsert`.

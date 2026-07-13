# Database SQL Folder

Files in this folder:

- `current_schema.sql` - original schema snapshot for context.
- `migration_add_images_website.sql` - adds `images` and `website_url` to `projects`.
- `storage_projects_bucket.sql` - creates the public Supabase Storage bucket and policies for project images.
- `seed_default_projects.sql` - upserts the sample portfolio projects into Supabase.

How to run:

1. Open your Supabase project, then go to SQL Editor > New query.
2. Run `migration_add_images_website.sql`.
3. Run `storage_projects_bucket.sql`.
4. Upload the three seed images to Supabase Storage in bucket `projects`, folder `seed`:
   - `acapolite_mockup_1783694349319.jpg`
   - `genexam_mockup_1783694362695.jpg`
   - `wishergiver_mockup_1783694374358.jpg`
5. Run `seed_default_projects.sql`.

Notes:

- `seed_default_projects.sql` uses `on conflict (id) do update`, so it can be run multiple times without duplicate primary key errors.
- Admin-created images are uploaded through `/api/upload-image` into the Supabase Storage `projects` bucket.
- Project rows and image URLs are stored in Supabase; the app no longer saves project edits to local memory.

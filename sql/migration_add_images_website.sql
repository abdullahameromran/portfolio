-- Migration: Add images (jsonb) and website_url to projects
-- Run this in Supabase SQL editor (SQL -> New query)

begin;

alter table public.projects
  add column if not exists images jsonb default '[]'::jsonb;

alter table public.projects
  add column if not exists website_url text;

-- Ensure RLS is enabled and create simple public CRUD policies if not present
alter table public.projects enable row level security;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p
      JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
      JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Allow public read-only access on projects'
      AND n.nspname = 'public'
      AND c.relname = 'projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public read-only access on projects" ON public.projects FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p
      JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
      JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Allow public insert access on projects'
      AND n.nspname = 'public'
      AND c.relname = 'projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public insert access on projects" ON public.projects FOR INSERT WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p
      JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
      JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Allow public update access on projects'
      AND n.nspname = 'public'
      AND c.relname = 'projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public update access on projects" ON public.projects FOR UPDATE USING (true) WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p
      JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
      JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Allow public delete access on projects'
      AND n.nspname = 'public'
      AND c.relname = 'projects'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public delete access on projects" ON public.projects FOR DELETE USING (true)';
  END IF;
END
$$;

commit;

-- Note: If you prefer images stored in a separate table, consider creating a projects_images table
-- with project_id, path, and metadata instead of a jsonb column.

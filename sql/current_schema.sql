-- CURRENT SCHEMA (context only)
-- WARNING: This schema is for context only and is not meant to be run as-is in production.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.projects (
  id text NOT NULL,
  title text NOT NULL,
  description text,
  long_description text,
  category text NOT NULL,
  tech_stack jsonb DEFAULT '[]'::jsonb,
  metrics jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  db_structure jsonb DEFAULT '[]'::jsonb,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.inquiries (
  id text NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  project_idea text,
  tech_stack_recommendation text,
  estimated_hours numeric DEFAULT 0,
  estimated_cost numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT inquiries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.guestbook (
  id text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  mood text NOT NULL,
  message text NOT NULL,
  coffee_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT guestbook_pkey PRIMARY KEY (id)
);

-- End of current schema

-- Seed sample projects into `projects` table
-- Run this after you have created the `projects` table and applied the migration.

insert into public.projects (id, title, description, long_description, category, tech_stack, metrics, features, db_structure, image_url, images, website_url, created_at)
values
('acapolite',
 'Acapolite Consulting — Tax & Client Management Platform',
 'A comprehensive client portal and automated tax reporting SaaS which optimizes consulting workflows.',
 'Acapolite Consulting is a top-tier client management and automated tax filing engine. Abdullah engineered this product on Bubble.io with complex backend schedules and custom JavaScript plug-ins. It empowers tax consultants to onboard clients, store encrypted documents, auto-calculate multi-jurisdiction liabilities, and auto-generate clean PDF dossiers.',
 'Client Portal',
 '[]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '/images/acapolite_mockup_1783694349319.jpg',
 '[]'::jsonb,
 NULL,
 now()
);

insert into public.projects (id, title, description, long_description, category, tech_stack, metrics, features, db_structure, image_url, images, website_url, created_at)
values
('genexam',
 'Gen Exam Platform',
 'An AI-powered academic assessment builder which instantly drafts syllabus-compliant examinations from textbooks.',
 'Gen Exam is a modern custom-coded Next.js SaaS designed for university departments and tutoring networks. Abdullah constructed the platform using Next.js 14, Tailwind CSS, and Supabase. The product utilizes OpenAI & Gemini API pipelines to digest raw textbook PDFs, map them onto local curriculum hierarchies, and auto-synthesize context-aware multiple-choice, short-answer, and essay exams.',
 'SaaS',
 '[]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '/images/genexam_mockup_1783694362695.jpg',
 '[]'::jsonb,
 NULL,
 now()
);

insert into public.projects (id, title, description, long_description, category, tech_stack, metrics, features, db_structure, image_url, images, website_url, created_at)
values
('wishergiver',
 'Wisher&Giver Dashboard Store',
 'A collaborative social gifting marketplace with real-time product registries and micro-merchant administration panels.',
 'Wisher&Giver is a collaborative gifting social-registry platform designed to link gift creators to social buyers. Built to scale, Abdullah drafted the frontend and admin panels, connecting them to secure Stripe Connect accounts. It implements real-time notifications via webhooks, automated cart tracking, automated shipping splits for micro-merchants, and an automated gifting ticker.',
 'MVP',
 '[]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb,
 '/images/wishergiver_mockup_1783694374358.jpg',
 '[]'::jsonb,
 NULL,
 now()
);

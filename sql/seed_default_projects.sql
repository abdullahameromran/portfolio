-- Seed or update portfolio projects in Supabase.
-- Safe to run multiple times: existing rows are updated by id.

insert into public.projects (
  id,
  title,
  description,
  long_description,
  category,
  tech_stack,
  metrics,
  features,
  db_structure,
  image_url,
  images,
  website_url,
  created_at
)
values
(
  'acapolite',
  'Acapolite Consulting - Tax & Client Management Platform',
  'A comprehensive client portal and automated tax reporting SaaS which optimizes consulting workflows.',
  'Acapolite Consulting is a top-tier client management and automated tax filing engine. Abdullah engineered this product on Bubble.io with complex backend schedules and custom JavaScript plug-ins. It empowers tax consultants to onboard clients, store encrypted documents, auto-calculate multi-jurisdiction liabilities, and auto-generate clean PDF dossiers. It also incorporates fully automated Stripe recurring plans and subscription locks.',
  'Client Portal',
  '["Bubble.io", "Custom JS Plugins", "Stripe Checkout", "PDF Rendering Engine", "SendGrid API"]'::jsonb,
  '["Automates 80% of client document filing", "Supports 1,200+ concurrent clients", "Decreased audit-prep cycles from 3 days to 4 minutes"]'::jsonb,
  '["Encrypted Document Safe and custom multi-role file sharing", "Custom JavaScript tax logic engine bypassing standard platform speed limits", "Stripe Customer Billing Portal and automated invoice webhooks", "Dynamic HTML-to-PDF reports compiled automatically with client parameters"]'::jsonb,
  '[{"table":"User (Consultants & Clients)","fields":["Email","Role","Stripe_Customer_ID","Consultant_Reference","Status"]},{"table":"Tax_Dossier","fields":["Dossier_ID","Owner_User","Tax_Year","State_Jurisdiction","Raw_Inputs_JSON","Status"]},{"table":"Report_Document","fields":["Document_ID","Dossier_Reference","File_Storage_URL","PDF_Mime_Type","Created_Date"]},{"table":"Subscription_State","fields":["Subscription_ID","Active_User","Stripe_Subscription_ID","Plan_Type","Expiry_Date"]}]'::jsonb,
  'https://fndjxryvchzuotvllzyh.supabase.co/storage/v1/object/public/projects/seed/acapolite_mockup_1783694349319.jpg',
  '["https://fndjxryvchzuotvllzyh.supabase.co/storage/v1/object/public/projects/seed/acapolite_mockup_1783694349319.jpg"]'::jsonb,
  'https://acapoliteconsulting.co.za/',
  now()
),
(
  'genexam',
  'Gen Exam Platform',
  'An AI-powered academic assessment builder which instantly drafts syllabus-compliant examinations from textbooks.',
  'Gen Exam is a modern custom-coded Next.js SaaS designed for university departments and tutoring networks. Abdullah constructed the platform using Next.js 14, Tailwind CSS, and Supabase. The product utilizes OpenAI and Gemini API pipelines to digest raw textbook PDFs, map them onto local curriculum hierarchies, and auto-synthesize context-aware multiple-choice, short-answer, and essay exams. It features full grading dashboards and immediate feedback tracking.',
  'SaaS',
  '["Next.js", "Supabase DB", "Gemini / OpenAI API", "Tailwind CSS", "Resend SMTP", "Vector Embeddings"]'::jsonb,
  '["15,000+ custom assessments drafted", "99.4% semantic correctness rating from academics", "SaaS user onboarding in < 20 seconds"]'::jsonb,
  '["Multimodal PDF reading pipeline using vector chunking (RAG)", "Advanced LLM temperature gating for syllabus-compliant question generation", "Interactive student browser testing module with real-time countdown clocks", "Educator analytics gradebooks powered by lightning-fast Supabase aggregation queries"]'::jsonb,
  '[{"table":"Institution & Departments","fields":["ID","Name","Plan_Level","Max_Instructors","Created_At"]},{"table":"Educator_Profile","fields":["ID","User_UUID","Department_ID","Subject_Specialty","Invite_Status"]},{"table":"Assessment_Draft","fields":["ID","Instructor_ID","Syllabus_Tags","Difficulty_Gating","Questions_JSON","Active_State"]},{"table":"Student_Response","fields":["ID","Assessment_ID","Student_Name","Answers_JSON","AI_Feedback_Markdown","Numeric_Score"]}]'::jsonb,
  'https://fndjxryvchzuotvllzyh.supabase.co/storage/v1/object/public/projects/seed/genexam_mockup_1783694362695.jpg',
  '["https://fndjxryvchzuotvllzyh.supabase.co/storage/v1/object/public/projects/seed/genexam_mockup_1783694362695.jpg"]'::jsonb,
  null,
  now()
),
(
  'wishergiver',
  'Wisher&Giver Dashboard Store',
  'A collaborative social gifting marketplace with real-time product registries and micro-merchant administration panels.',
  'Wisher&Giver is a collaborative gifting social-registry platform designed to link gift creators to social buyers. Built to scale, Abdullah drafted the frontend and admin panels, connecting them to secure Stripe Connect accounts. It implements real-time notifications via webhooks, automated cart tracking, automated shipping splits for micro-merchants, and an automated gifting ticker.',
  'MVP',
  '["Bubble.io", "Stripe Connect", "n8n Automation", "Firebase Admin", "Postmark API"]'::jsonb,
  '["Processed $45,000+ in wish validations", "Onboarded 180+ micro-merchants into dashboards", "Webhook response rate optimized to < 85ms"]'::jsonb,
  '["Stripe Connect custom onboarding flow supporting split checkout commissions", "Real-time registry tracking with state locking preventing double-gifts", "Custom n8n integration pipelines coordinating vendor notifications", "Interactive vendor performance dashboards and shipping state panels"]'::jsonb,
  '[{"table":"Merchant_Store","fields":["Store_ID","Store_Name","Stripe_Connect_ID","Commission_Rate","Status"]},{"table":"Wishlist_Registry","fields":["Registry_ID","Creator_User","Occasion_Date","Is_Public","Shareable_Slug"]},{"table":"Registry_Item","fields":["Item_ID","Registry_Reference","Product_Name","Price","Reserved_By_User","Purchase_State"]},{"table":"Split_Transaction","fields":["Tx_ID","Total_Amount","Merchant_Payout","Platform_Commission","Stripe_Charge_ID"]}]'::jsonb,
  'https://fndjxryvchzuotvllzyh.supabase.co/storage/v1/object/public/projects/seed/wishergiver_mockup_1783694374358.jpg',
  '["https://fndjxryvchzuotvllzyh.supabase.co/storage/v1/object/public/projects/seed/wishergiver_mockup_1783694374358.jpg"]'::jsonb,
  null,
  now()
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  long_description = excluded.long_description,
  category = excluded.category,
  tech_stack = excluded.tech_stack,
  metrics = excluded.metrics,
  features = excluded.features,
  db_structure = excluded.db_structure,
  image_url = excluded.image_url,
  images = excluded.images,
  website_url = excluded.website_url;

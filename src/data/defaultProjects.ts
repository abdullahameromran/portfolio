import { Project } from "../types";

const defaultProjects: Project[] = [
  {
    id: "acapolite",
    title: "Acapolite Consulting — Tax & Client Management Platform",
    description: "A comprehensive client portal and automated tax reporting SaaS which optimizes consulting workflows.",
    longDescription: "Acapolite Consulting is a top-tier client management and automated tax filing engine. Abdullah engineered this product on Bubble.io with complex backend schedules and custom JavaScript plug-ins. It empowers tax consultants to onboard clients, store encrypted documents, auto-calculate multi-jurisdiction liabilities, and auto-generate clean PDF dossiers.",
    category: "Client Portal",
    techStack: ["Bubble.io", "Custom JS Plugins", "Stripe Checkout", "PDF Rendering Engine", "SendGrid API"],
    metrics: ["Automates 80% of client document filing"],
    features: [
      "Encrypted Document Safe and custom multi-role file sharing",
      "Custom JavaScript tax logic engine",
      "Stripe Customer Billing Portal and automated invoice webhooks",
      "Dynamic HTML-to-PDF reports compiled automatically"
    ],
    dbStructure: [
      { table: "User (Consultants & Clients)", fields: ["Email", "Role", "Stripe_Customer_ID", "Consultant_Reference", "Status"] },
      { table: "Tax_Dossier", fields: ["Dossier_ID", "Owner_User", "Tax_Year", "State_Jurisdiction", "Raw_Inputs_JSON", "Status"] }
    ],
    imageUrl: "/src/assets/images/acapolite_mockup_1783694349319.jpg"
  },
  {
    id: "genexam",
    title: "Gen Exam Platform",
    description: "An AI-powered academic assessment builder which instantly drafts syllabus-compliant examinations from textbooks.",
    longDescription: "Gen Exam is a modern custom-coded Next.js SaaS designed for university departments and tutoring networks. Abdullah constructed the platform using Next.js 14, Tailwind CSS, and Supabase. The product utilizes OpenAI & Gemini API pipelines to digest raw textbook PDFs, map them onto local curriculum hierarchies, and auto-synthesize context-aware questions.",
    category: "SaaS",
    techStack: ["Next.js", "Supabase DB", "Gemini / OpenAI API", "Tailwind CSS", "Vector Embeddings"],
    metrics: ["15,000+ custom assessments drafted"],
    features: [
      "Multimodal PDF reading pipeline using vector chunking (RAG)",
      "LLM temperature gating for syllabus-compliant question generation",
      "Interactive student browser testing module"
    ],
    dbStructure: [
      { table: "Assessment_Draft", fields: ["ID", "Instructor_ID", "Syllabus_Tags", "Questions_JSON", "Active_State"] }
    ],
    imageUrl: "/src/assets/images/genexam_mockup_1783694362695.jpg"
  }
];

export default defaultProjects;

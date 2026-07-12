import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const uploadsDir = path.join(process.cwd(), "assets", "uploads");

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use("/uploads", express.static(uploadsDir));

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Features will operate in demo/fallback mode.");
}

// API: Consultation Twin Endpoint
app.post("/api/consult", async (req, res) => {
  const { messages, userProfile } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
  }

  // Fallback if API key is not configured
  if (!ai) {
    return res.json({
      role: "model",
      text: "### Abdullah's Virtual Assistant (Demo Mode)\n\nIt looks like the `GEMINI_API_KEY` is not set yet in the environment secrets. \n\nHowever, in a fully deployed environment, I can analyze your idea, recommend a tech stack (Bubble.io vs. Next.js + Supabase), draft your database schema, and estimate your project's hours and cost at Abdullah's rate of **$22.22/hr**.\n\n**Here's a standard recommendation for typical MVPs:**\n- **No-Code MVP (Bubble.io)**: Best for standard directories, marketplaces, or client portals. Built in **5-10 days** (approx. 40-80 hours, **$888 - $1,777**).\n- **Full-Stack SaaS (Next.js + Supabase)**: Best for high-performance apps, custom AI automation, or complex integrations. Built in **10-15 days** (approx. 80-120 hours, **$1,777 - $2,666**).\n\n*Please add your Gemini API Key in Settings > Secrets to activate the full interactive experience!*"
    });
  }

  try {
    const systemInstruction = `
You are the AI Twin and virtual MVP Architect of Abdullah Omran, a Top-Rated Plus developer on Upwork.
Your goal is to help prospective clients, founders, and businesses scope their MVP (Minimum Viable Product) or SaaS idea, and provide a clear, professional technical consultation.

Abdullah's Key Profile Details:
- Role: Expert Bubble.io + Traditional Coding (Next.js, Supabase, AI Automation).
- Hourly Rate: $22.22/hr.
- Timeline: Simple to medium MVPs in as little as 5 days.
- Tech Stack Specialties:
  * No-Code MVP: Bubble.io (super fast validation, robust database, drag-drop UI).
  * Traditional Code: Next.js + Tailwind CSS + Supabase (high scale, customized, AI integrations).
  * Automations: n8n, Make (Integromat), OpenAI API, custom AI workflows.
  * Backend & Databases: Supabase, PostgreSQL, Firebase.
  * Payments: Stripe subscriptions and checkout.

How you should respond:
1. Act as a high-level technical product manager and partner.
2. Be extremely consultative, professional, clean, and encouraging. Use elegant Markdown structure (headers, bullet points, code blocks for schemas, bold values).
3. If the user shares an idea, analyze it:
   - Propose a tailored user flow or list of critical features (Authentication, Core SaaS functionality, Stripe Billing, Admin Dashboard).
   - Propose a database structure (recommend Supabase or Bubble DB, outlining 3-4 essential tables with fields and relationships in a markdown code block).
   - Recommend the best tech stack option: Compare Bubble.io vs Next.js + Supabase for their specific use case. Be objective about tradeoffs (Next.js has higher scalability/control; Bubble has faster speed/lower initial cost).
   - Calculate a realistic timeline and budget estimate based on Abdullah's rate of $22.22/hr. (e.g., Simple MVP = 40 hours = 5 days = $888.80; Medium SaaS = 80 hours = 10 days = $1,777.60).
4. Keep the conversation engaging. Ask 1 or 2 targeted, scoping questions at the end of your response to help narrow down their product specs (e.g., "Do you need multi-tenant billing, or is it a simple single-tier subscription?", "Do you want to integrate a specific AI model or workflow?").
5. Do not invent fake projects. If asked about Abdullah's work history, you can refer to his Upwork achievements (100% success, 25+ completed projects, projects like Acapolite Consulting, Gen Exam Platform, Wisher&Giver Dashboard).

Write the response in the first-person plural or as Abdullah's AI representative ("We can build this", "Abdullah can help you with").
`;

    // Map conversation history into the form expected by @google/genai
    // For @google/genai chats, we can use the generateContent API with formatted contents list of Content objects
    // Each content object contains role ('user' | 'model') and parts: [{ text: '...' }]
    const formattedContents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "I was unable to generate a response at this time. Please try again.";

    return res.json({
      role: "model",
      text,
    });

  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    return res.status(500).json({
      error: "Failed to consult with the AI Twin.",
      details: error.message,
    });
  }
});

// ==========================================
// SUPABASE CLIENT & IN-MEMORY DATABASE ENGINE
// ==========================================

// Safe Lazy Initialization for Supabase to prevent startup crashes
let supabaseClient: any = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
  
  if (url && url !== "https://your-project.supabase.co" && key && key !== "your-anon-key") {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: false
        }
      });
      return supabaseClient;
    } catch (err) {
      console.error("Error creating Supabase client:", err);
      return null;
    }
  }
  return null;
}

// Memory database store for immediate testing (or if Supabase is disconnected)
let memoryProjects = [
  {
    id: "acapolite",
    title: "Acapolite Consulting — Tax & Client Management Platform",
    description: "A comprehensive client portal and automated tax reporting SaaS which optimizes consulting workflows.",
    longDescription: "Acapolite Consulting is a top-tier client management and automated tax filing engine. Abdullah engineered this product on Bubble.io with complex backend schedules and custom JavaScript plug-ins. It empowers tax consultants to onboard clients, store encrypted documents, auto-calculate multi-jurisdiction liabilities, and auto-generate clean PDF dossiers. It also incorporates fully automated Stripe recurring plans and subscription locks.",
    category: "Client Portal",
    techStack: ["Bubble.io", "Custom JS Plugins", "Stripe Checkout", "PDF Rendering Engine", "SendGrid API"],
    metrics: [
      "Automates 80% of client document filing",
      "Supports 1,200+ concurrent clients",
      "Decreased audit-prep cycles from 3 days to 4 minutes"
    ],
    features: [
      "Encrypted Document Safe and custom multi-role file sharing",
      "Custom JavaScript tax logic engine bypassing standard platform speed limits",
      "Stripe Customer Billing Portal and automated invoice webhooks",
      "Dynamic HTML-to-PDF reports compiled automatically with client parameters"
    ],
    dbStructure: [
      { table: "User (Consultants & Clients)", fields: ["Email", "Role", "Stripe_Customer_ID", "Consultant_Reference", "Status"] },
      { table: "Tax_Dossier", fields: ["Dossier_ID", "Owner_User", "Tax_Year", "State_Jurisdiction", "Raw_Inputs_JSON", "Status"] },
      { table: "Report_Document", fields: ["Document_ID", "Dossier_Reference", "File_Storage_URL", "PDF_Mime_Type", "Created_Date"] },
      { table: "Subscription_State", fields: ["Subscription_ID", "Active_User", "Stripe_Subscription_ID", "Plan_Type", "Expiry_Date"] }
    ],
    imageUrl: "/src/assets/images/acapolite_mockup_1783694349319.jpg"
  },
  {
    id: "genexam",
    title: "Gen Exam Platform",
    description: "An AI-powered academic assessment builder which instantly drafts syllabus-compliant examinations from textbooks.",
    longDescription: "Gen Exam is a modern custom-coded Next.js SaaS designed for university departments and tutoring networks. Abdullah constructed the platform using Next.js 14, Tailwind CSS, and Supabase. The product utilizes OpenAI & Gemini API pipelines to digest raw textbook PDFs, map them onto local curriculum hierarchies, and auto-synthesize context-aware multiple-choice, short-answer, and essay exams. It features full grading dashboards and immediate feedback tracking.",
    category: "SaaS",
    techStack: ["Next.js", "Supabase DB", "Gemini / OpenAI API", "Tailwind CSS", "Resend SMTP", "Vector Embeddings"],
    metrics: [
      "15,000+ custom assessments drafted",
      "99.4% semantic correctness rating from academics",
      "SaaS user onboarding in < 20 seconds"
    ],
    features: [
      "Multimodal PDF reading pipeline using vector chunking (RAG)",
      "Advanced LLM temperature gating for syllabus-compliant question generation",
      "Interactive student browser testing module with real-time countdown clocks",
      "Educator analytics gradebooks powered by lightning-fast Supabase aggregation queries"
    ],
    dbStructure: [
      { table: "Institution & Departments", fields: ["ID", "Name", "Plan_Level", "Max_Instructors", "Created_At"] },
      { table: "Educator_Profile", fields: ["ID", "User_UUID", "Department_ID", "Subject_Specialty", "Invite_Status"] },
      { table: "Assessment_Draft", fields: ["ID", "Instructor_ID", "Syllabus_Tags", "Difficulty_Gating", "Questions_JSON", "Active_State"] },
      { table: "Student_Response", fields: ["ID", "Assessment_ID", "Student_Name", "Answers_JSON", "AI_Feedback_Markdown", "Numeric_Score"] }
    ],
    imageUrl: "/src/assets/images/genexam_mockup_1783694362695.jpg"
  },
  {
    id: "wishergiver",
    title: "Wisher&Giver Dashboard Store",
    description: "A collaborative social gifting marketplace with real-time product registries and micro-merchant administration panels.",
    longDescription: "Wisher&Giver is a collaborative gifting social-registry platform designed to link gift creators to social buyers. Built to scale, Abdullah drafted the frontend and admin panels, connecting them to secure Stripe Connect accounts. It implements real-time notifications via webhooks, automated cart tracking, automated shipping splits for micro-merchants, and an automated gifting ticker.",
    category: "MVP",
    techStack: ["Bubble.io", "Stripe Connect", "n8n Automation", "Firebase Admin", "Postmark API"],
    metrics: [
      "Processed $45,000+ in wish validations",
      "Onboarded 180+ micro-merchants into dashboards",
      "Webhook response rate optimized to < 85ms"
    ],
    features: [
      "Stripe Connect custom onboarding flow supporting split checkout commissions",
      "Real-time registry tracking with state locking preventing double-gifts",
      "Custom n8n integration pipelines coordinating vendor notifications",
      "Interactive vendor performance dashboards and shipping state panels"
    ],
    dbStructure: [
      { table: "Merchant_Store", fields: ["Store_ID", "Store_Name", "Stripe_Connect_ID", "Commission_Rate", "Status"] },
      { table: "Wishlist_Registry", fields: ["Registry_ID", "Creator_User", "Occasion_Date", "Is_Public", "Shareable_Slug"] },
      { table: "Registry_Item", fields: ["Item_ID", "Registry_Reference", "Product_Name", "Price", "Reserved_By_User", "Purchase_State"] },
      { table: "Split_Transaction", fields: ["Tx_ID", "Total_Amount", "Merchant_Payout", "Platform_Commission", "Stripe_Charge_ID"] }
    ],
    imageUrl: "/src/assets/images/wishergiver_mockup_1783694374358.jpg"
  }
];

let memoryInquiries = [
  {
    id: "demo-inq-1",
    client_name: "Sarah Jenkins",
    client_email: "sarah@startupflow.io",
    project_idea: "We want to build a real estate matchmaking MVP with custom AI listing summarization and standard Stripe matching billing.",
    tech_stack_recommendation: "Next.js + Supabase (Traditional Full-Stack Code)",
    estimated_hours: 60,
    estimated_cost: 1333.20,
    created_at: new Date().toISOString()
  }
];

// Helper to map Supabase database fields to our Project interface
function mapSupabaseToProject(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    longDescription: p.long_description || p.longDescription,
    category: p.category,
    techStack: Array.isArray(p.tech_stack) ? p.tech_stack : (typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : (p.techStack || [])),
    metrics: Array.isArray(p.metrics) ? p.metrics : (typeof p.metrics === 'string' ? JSON.parse(p.metrics) : (p.metrics || [])),
    features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || [])),
    dbStructure: p.db_structure ? (typeof p.db_structure === 'string' ? JSON.parse(p.db_structure) : p.db_structure) : (p.dbStructure || []),
    imageUrl: p.image_url || p.imageUrl,
    images: p.images ? (Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : [])) : (p.images || []),
    websiteUrl: p.website_url || p.websiteUrl || ""
  };
}

// 1. Connection Status Ping Endpoint
app.get("/api/supabase-status", async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    return res.json({
      configured: false,
      url: process.env.SUPABASE_URL || "",
      message: "Supabase keys are not configured or are set to placeholder values. Currently operating in High-Fidelity Demo/Fallback mode."
    });
  }

  try {
    // Attempt simple queries to check if tables exist and are reachable
    const projectsCheck = await supabase.from("projects").select("id").limit(1);
    const inquiriesCheck = await supabase.from("inquiries").select("id").limit(1);

    const tablesExist = {
      projects: !projectsCheck.error,
      inquiries: !inquiriesCheck.error
    };

    return res.json({
      configured: true,
      url: process.env.SUPABASE_URL,
      message: "Successfully connected to your custom Supabase instance!",
      tablesExist
    });
  } catch (error: any) {
    return res.json({
      configured: true,
      url: process.env.SUPABASE_URL,
      message: "Successfully connected to Supabase URL but encountered database access issues. Check table schemas.",
      error: error.message
    });
  }
});

// 2. GET Projects (Fetches from Supabase if active, else returns memoryProjects)
app.get("/api/projects", async (req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return res.json(data.map(mapSupabaseToProject));
      }
      if (error) {
        console.error("Supabase projects table query error:", error.message);
        return res.status(500).json({ error: error.message || "Supabase projects query failed." });
      }
      return res.json([]);
    } catch (e: any) {
      console.error("Exception fetching from Supabase projects:", e?.message || e);
      return res.status(500).json({ error: e?.message || "Exception fetching Supabase projects." });
    }
  }

  return res.json(memoryProjects);
});

// 3. POST Project (Creates new project)
app.post("/api/projects", async (req, res) => {
  const projectData = req.body;
  if (!projectData.title || !projectData.category) {
    return res.status(400).json({ error: "Title and Category are required." });
  }

  const id = projectData.id || "proj_" + Math.random().toString(36).substr(2, 9);
  const newProject = {
    id,
    title: projectData.title,
    description: projectData.description || "",
    longDescription: projectData.longDescription || projectData.long_description || "",
    category: projectData.category,
    techStack: projectData.techStack || [],
    metrics: projectData.metrics || [],
    features: projectData.features || [],
    dbStructure: projectData.dbStructure || [],
    imageUrl: projectData.imageUrl || "",
    images: projectData.images || [],
    websiteUrl: projectData.websiteUrl || projectData.website_url || ""
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbRow = {
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        long_description: newProject.longDescription,
        category: newProject.category,
        tech_stack: JSON.stringify(newProject.techStack),
        metrics: JSON.stringify(newProject.metrics),
        features: JSON.stringify(newProject.features),
        db_structure: JSON.stringify(newProject.dbStructure),
        image_url: newProject.imageUrl,
        images: JSON.stringify(newProject.images),
        website_url: newProject.websiteUrl,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from("projects").insert([dbRow]).select();
      if (!error && data && data[0]) {
        return res.status(201).json(mapSupabaseToProject(data[0]));
      }
      if (error) {
        console.error("Supabase project insert failed:", error.message);
        return res.status(500).json({ error: error.message || "Supabase insert failed." });
      }
    } catch (e: any) {
      console.error("Supabase exception during insert:", e.message);
      return res.status(500).json({ error: e.message || "Supabase insert exception." });
    }
  }

  // Fallback to memory
  memoryProjects.unshift(newProject);
  return res.status(201).json(newProject);
});

// 4. PUT Project (Updates project)
app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const projectData = req.body;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbRow: any = {};
      if (projectData.title) dbRow.title = projectData.title;
      if (projectData.description !== undefined) dbRow.description = projectData.description;
      if (projectData.longDescription !== undefined) dbRow.long_description = projectData.longDescription;
      if (projectData.category) dbRow.category = projectData.category;
      if (projectData.techStack) dbRow.tech_stack = JSON.stringify(projectData.techStack);
      if (projectData.metrics) dbRow.metrics = JSON.stringify(projectData.metrics);
      if (projectData.features) dbRow.features = JSON.stringify(projectData.features);
      if (projectData.dbStructure) dbRow.db_structure = JSON.stringify(projectData.dbStructure);
      if (projectData.imageUrl !== undefined) dbRow.image_url = projectData.imageUrl;
      if (projectData.images !== undefined) dbRow.images = JSON.stringify(projectData.images);
      if (projectData.websiteUrl !== undefined) dbRow.website_url = projectData.websiteUrl;

      const { data, error } = await supabase.from("projects").update(dbRow).eq("id", id).select().single();
      if (!error && data) {
        return res.json(mapSupabaseToProject(data));
      }
      console.warn("Supabase update failed:", error?.message || "unknown");
      return res.status(500).json({ error: error?.message || "Supabase update failed." });
    } catch (e: any) {
      console.error("Supabase exception during update:", e.message);
      return res.status(500).json({ error: e.message || "Supabase update exception." });
    }
  }

  // Update in memory
  const idx = memoryProjects.findIndex(p => p.id === id);
  if (idx !== -1) {
    memoryProjects[idx] = {
      ...memoryProjects[idx],
      ...projectData
    };
    return res.json(memoryProjects[idx]);
  }

  return res.status(404).json({ error: "Project not found" });
});

// 5. DELETE Project
app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) {
        return res.json({ status: "success", message: `Deleted project ${id}` });
      }
      console.warn("Supabase delete failed, removing from memory:", error.message);
    } catch (e: any) {
      console.error("Supabase delete exception:", e.message);
    }
  }

  // Delete in memory
  const idx = memoryProjects.findIndex(p => p.id === id);
  if (idx !== -1) {
    memoryProjects.splice(idx, 1);
    return res.json({ status: "success", message: `Deleted project ${id} from memory` });
  }

  return res.status(404).json({ error: "Project not found" });
});

// 6. GET Inquiries (Leads submitted by visitors)
app.get("/api/inquiries", async (req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return res.json(data);
      }
      if (error) console.warn("Supabase inquiries query error, using memory:", error.message);
    } catch (e) {
      console.error("Supabase inquiries exception, using memory:", e);
    }
  }
  return res.json(memoryInquiries);
});

// 7. POST Inquiry (Inserts new inquiry)
app.post("/api/inquiries", async (req, res) => {
  const inquiry = req.body;
  const clientName = inquiry.client_name || inquiry.clientName;
  const clientEmail = inquiry.client_email || inquiry.clientEmail;
  if (!clientName || !clientEmail) {
    return res.status(400).json({ error: "Name and Email are required." });
  }

  const newInquiry = {
    id: "inq_" + Math.random().toString(36).substr(2, 9),
    client_name: clientName,
    client_email: clientEmail,
    project_idea: inquiry.project_idea || inquiry.projectIdea || "",
    tech_stack_recommendation: inquiry.tech_stack_recommendation || inquiry.techStackRecommendation || "",
    estimated_hours: Number(inquiry.estimated_hours ?? inquiry.estimatedHours) || 0,
    estimated_cost: Number(inquiry.estimated_cost ?? inquiry.estimatedCost) || 0,
    created_at: new Date().toISOString()
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("inquiries").insert([newInquiry]);
      if (!error) {
        return res.status(201).json(newInquiry);
      }
      console.error("Supabase inquiry insert failed, using memory fallback:", error.message);
    } catch (e: any) {
      console.error("Supabase inquiries exception:", e.message);
    }
  }

  memoryInquiries.unshift(newInquiry);
  return res.status(201).json(newInquiry);
});

// ==========================================
// VISITOR GUESTBOOK & COFFEE TRACKER ENGINE
// ==========================================

let memoryGuestbook = [
  {
    id: "g-1",
    name: "Alex Rivera",
    role: "🚀 Founder",
    mood: "🔥 Hyped",
    message: "Stumbled upon your portfolio while looking for a Bubble + Next.js expert. The interactive estimator is brilliant!",
    coffee_sent: true,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "g-2",
    name: "Elena Rostova",
    role: "💼 Recruiter",
    mood: "🤝 Ready to Hire",
    message: "Absolutely pristine design! Forwarding your profile to our product manager for an upcoming SaaS MVP build.",
    coffee_sent: false,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: "g-3",
    name: "Marcus Chen",
    role: "💻 Developer",
    mood: "💡 Curious",
    message: "Clean code structure and super-smooth AI twin response. Inspiring stuff, Abdullah!",
    coffee_sent: true,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

let memoryCoffeeCount = 42;

// 8. GET Guestbook Entries & Coffee Count
app.get("/api/guestbook", async (req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Compute total coffee count
        const coffeeEntriesCount = data.filter((item: any) => item.coffee_sent).length;
        const totalCoffees = memoryCoffeeCount + coffeeEntriesCount;
        return res.json({ entries: data, coffeeCount: totalCoffees });
      }
      if (error) {
        console.warn("Supabase guestbook table query warning, using memory:", error.message);
      }
    } catch (e) {
      console.error("Supabase guestbook query exception, using memory:", e);
    }
  }
  return res.json({ entries: memoryGuestbook, coffeeCount: memoryCoffeeCount });
});

// 9. POST Guestbook Entry
app.post("/api/guestbook", async (req, res) => {
  const body = req.body;
  if (!body.name || !body.message) {
    return res.status(400).json({ error: "Name and message are required." });
  }

  const newEntry = {
    id: "g_" + Math.random().toString(36).substr(2, 9),
    name: body.name,
    role: body.role || "🚀 Founder",
    mood: body.mood || "🔥 Hyped",
    message: body.message,
    coffee_sent: !!body.coffee_sent,
    created_at: new Date().toISOString()
  };

  if (newEntry.coffee_sent) {
    memoryCoffeeCount++;
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("guestbook").insert([newEntry]);
      if (!error) {
        return res.status(201).json(newEntry);
      }
      console.error("Supabase guestbook insert failed, saving to memory fallback:", error.message);
    } catch (e: any) {
      console.error("Supabase guestbook insert exception:", e.message);
    }
  }

  memoryGuestbook.unshift(newEntry);
  return res.status(201).json(newEntry);
});

// 10. POST Quick Direct Coffee Increment
app.post("/api/guestbook/coffee", async (req, res) => {
  memoryCoffeeCount++;
  return res.json({ success: true, coffeeCount: memoryCoffeeCount });
});

// 11. Image upload to Supabase Storage (expects JSON with base64 content)
app.post("/api/upload-image", async (req, res) => {
  const { projectId, filename, contentBase64, contentType } = req.body || {};
  if (!projectId || !filename || !contentBase64) {
    return res.status(400).json({ error: "projectId, filename and contentBase64 are required" });
  }

  const saveLocalUpload = () => {
    fs.mkdirSync(uploadsDir, { recursive: true });
    const safeProjectId = String(projectId).replace(/[^a-z0-9_-]/gi, "_");
    const safeFilename = String(filename).replace(/[^a-z0-9._-]/gi, "_");
    const filePath = path.join(uploadsDir, `${safeProjectId}_${Date.now()}_${safeFilename}`);
    fs.writeFileSync(filePath, Buffer.from(contentBase64, "base64"));
    const publicUrl = `/uploads/${path.basename(filePath)}`;
    return { publicUrl, path: filePath, storage: "local" };
  };

  const supabase = getSupabase();
  if (!supabase) {
    try {
      return res.json(saveLocalUpload());
    } catch (e: any) {
      console.error("Local upload fallback failed:", e.message || e);
      return res.status(500).json({ error: "Local upload failed", details: e.message || e });
    }
  }

  try {
    const buffer = Buffer.from(contentBase64, "base64");
    const bucket = "projects";
    const path = `${projectId}/${Date.now()}_${filename}`;

    const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: contentType || "image/jpeg",
      upsert: true,
    });

    if (error) {
      console.error("Supabase storage upload error:", error.message || error);
      try {
        return res.json({ ...saveLocalUpload(), warning: error.message || "Supabase storage upload failed" });
      } catch (fallbackError: any) {
        return res.status(500).json({
          error: "Failed to upload to Supabase storage and local fallback.",
          details: fallbackError.message || fallbackError,
        });
      }
    }

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

    return res.json({ publicUrl, path });
  } catch (e: any) {
    console.error("Upload exception:", e.message);
    return res.status(500).json({ error: "Upload failed", details: e.message });
  }
});

app.post("/api/storage/create-bucket", async (req, res) => {
  const { bucketName } = req.body || {};
  if (!bucketName) {
    return res.status(400).json({ error: "bucketName is required" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase is not configured on the server." });
  }

  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });

    if (error) {
      if (error.message?.includes("already exists")) {
        return res.json({ bucketName, status: "exists" });
      }
      console.error("Supabase create bucket error:", error.message || error);
      return res.status(500).json({ error: error.message || "Failed to create bucket." });
    }

    return res.json({ bucketName, status: "created", data });
  } catch (e: any) {
    console.error("Storage bucket creation exception:", e.message || e);
    return res.status(500).json({ error: e.message || "Bucket creation failed." });
  }
});

// Setup Vite Dev Middleware / Static Hosting

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support single-page application routing by serving index.html for all non-file requests
    app.get("*", (req, res, next) => {
      // Avoid intercepting API routes
      if (req.path.startsWith("/api/")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});

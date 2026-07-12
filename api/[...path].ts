import { createClient } from "@supabase/supabase-js";

const fallbackProjects = [
  {
    id: "acapolite",
    title: "Acapolite Consulting - Tax & Client Management Platform",
    description: "A comprehensive client portal and automated tax reporting SaaS which optimizes consulting workflows.",
    longDescription: "Acapolite Consulting is a top-tier client management and automated tax filing engine. Abdullah engineered this product on Bubble.io with complex backend schedules and custom JavaScript plug-ins.",
    category: "Client Portal",
    techStack: ["Bubble.io", "Custom JS Plugins", "Stripe Checkout", "PDF Rendering Engine", "SendGrid API"],
    metrics: ["Automates 80% of client document filing"],
    features: ["Encrypted document safe", "Stripe billing portal", "Dynamic PDF reports"],
    dbStructure: [],
    imageUrl: "/images/acapolite_mockup_1783694349319.jpg",
    images: ["/images/acapolite_mockup_1783694349319.jpg"],
    websiteUrl: "https://acapoliteconsulting.co.za/",
  },
  {
    id: "genexam",
    title: "Gen Exam Platform",
    description: "An AI-powered academic assessment builder which instantly drafts syllabus-compliant examinations from textbooks.",
    longDescription: "Gen Exam is a modern custom-coded Next.js SaaS designed for university departments and tutoring networks.",
    category: "SaaS",
    techStack: ["Next.js", "Supabase DB", "Gemini / OpenAI API", "Tailwind CSS"],
    metrics: ["15,000+ custom assessments drafted"],
    features: ["PDF reading pipeline", "AI question generation", "Educator analytics"],
    dbStructure: [],
    imageUrl: "/images/genexam_mockup_1783694362695.jpg",
    images: ["/images/genexam_mockup_1783694362695.jpg"],
    websiteUrl: "",
  },
  {
    id: "wishergiver",
    title: "Wisher&Giver Dashboard Store",
    description: "A collaborative social gifting marketplace with real-time product registries and micro-merchant administration panels.",
    longDescription: "Wisher&Giver is a collaborative gifting social-registry platform designed to link gift creators to social buyers.",
    category: "MVP",
    techStack: ["Bubble.io", "Stripe Connect", "n8n Automation", "Firebase Admin"],
    metrics: ["Processed $45,000+ in wish validations"],
    features: ["Stripe Connect onboarding", "Real-time registry tracking", "Vendor dashboards"],
    dbStructure: [],
    imageUrl: "/images/wishergiver_mockup_1783694374358.jpg",
    images: ["/images/wishergiver_mockup_1783694374358.jpg"],
    websiteUrl: "",
  },
];

let supabaseClient: any = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key || url === "https://your-project.supabase.co" || key === "your-anon-key") {
    return null;
  }

  supabaseClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return supabaseClient;
}

function sendJson(res: any, status: number, data: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function readBody(req: any) {
  return new Promise<any>((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk: Buffer) => {
      raw += chunk.toString();
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function parseJsonField(value: any, fallback: any[] = []) {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapSupabaseToProject(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description || "",
    longDescription: p.long_description || p.longDescription || "",
    category: p.category || "SaaS",
    techStack: parseJsonField(p.tech_stack || p.techStack),
    metrics: parseJsonField(p.metrics),
    features: parseJsonField(p.features),
    dbStructure: parseJsonField(p.db_structure || p.dbStructure),
    imageUrl: p.image_url || p.imageUrl || "",
    images: parseJsonField(p.images, p.image_url ? [p.image_url] : []),
    websiteUrl: p.website_url || p.websiteUrl || "",
  };
}

function projectToDbRow(projectData: any, id?: string) {
  return {
    ...(id ? { id } : {}),
    title: projectData.title,
    description: projectData.description || "",
    long_description: projectData.longDescription || projectData.long_description || "",
    category: projectData.category || "SaaS",
    tech_stack: projectData.techStack || projectData.tech_stack || [],
    metrics: projectData.metrics || [],
    features: projectData.features || [],
    db_structure: projectData.dbStructure || projectData.db_structure || [],
    image_url: projectData.imageUrl || projectData.image_url || projectData.images?.[0] || "",
    images: projectData.images || [],
    website_url: projectData.websiteUrl || projectData.website_url || "",
  };
}

export default async function handler(req: any, res: any) {
  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam.join("/") : String(pathParam || "");
  const supabase = getSupabase();

  try {
    if (path === "supabase-status" && req.method === "GET") {
      if (!supabase) {
        return sendJson(res, 200, {
          configured: false,
          url: process.env.SUPABASE_URL || "",
          message: "Supabase environment variables are missing on this deployment.",
        });
      }

      const projectsCheck = await supabase.from("projects").select("id").limit(1);
      const inquiriesCheck = await supabase.from("inquiries").select("id").limit(1);

      return sendJson(res, 200, {
        configured: true,
        url: process.env.SUPABASE_URL,
        message: "Connected to Supabase.",
        tablesExist: {
          projects: !projectsCheck.error,
          inquiries: !inquiriesCheck.error,
        },
        error: projectsCheck.error?.message || inquiriesCheck.error?.message,
      });
    }

    if (path === "projects" && req.method === "GET") {
      if (!supabase) return sendJson(res, 200, fallbackProjects);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return sendJson(res, 500, { error: error.message });
      return sendJson(res, 200, (data || []).map(mapSupabaseToProject));
    }

    if (path === "projects" && req.method === "POST") {
      if (!supabase) return sendJson(res, 503, { error: "Supabase is required for saving projects on Vercel." });

      const body = await readBody(req);
      if (!body.title || !body.category) return sendJson(res, 400, { error: "Title and Category are required." });

      const id = body.id || `proj_${Math.random().toString(36).slice(2, 11)}`;
      const row = projectToDbRow(body, id);
      const { data, error } = await supabase.from("projects").insert([row]).select().single();

      if (error) return sendJson(res, 500, { error: error.message });
      return sendJson(res, 201, mapSupabaseToProject(data));
    }

    const projectMatch = path.match(/^projects\/([^/]+)$/);
    if (projectMatch && req.method === "PUT") {
      if (!supabase) return sendJson(res, 503, { error: "Supabase is required for saving projects on Vercel." });

      const body = await readBody(req);
      const row = projectToDbRow(body);
      const { data, error } = await supabase
        .from("projects")
        .update(row)
        .eq("id", projectMatch[1])
        .select()
        .single();

      if (error) return sendJson(res, 500, { error: error.message });
      return sendJson(res, 200, mapSupabaseToProject(data));
    }

    if (projectMatch && req.method === "DELETE") {
      if (!supabase) return sendJson(res, 503, { error: "Supabase is required for deleting projects on Vercel." });

      const { error } = await supabase.from("projects").delete().eq("id", projectMatch[1]);
      if (error) return sendJson(res, 500, { error: error.message });
      return sendJson(res, 200, { status: "success" });
    }

    if (path === "inquiries" && req.method === "GET") {
      if (!supabase) return sendJson(res, 200, []);

      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return sendJson(res, 500, { error: error.message });
      return sendJson(res, 200, data || []);
    }

    if (path === "inquiries" && req.method === "POST") {
      if (!supabase) return sendJson(res, 503, { error: "Supabase is required for saving inquiries on Vercel." });

      const body = await readBody(req);
      const clientName = body.client_name || body.clientName;
      const clientEmail = body.client_email || body.clientEmail;
      if (!clientName || !clientEmail) return sendJson(res, 400, { error: "Name and Email are required." });

      const inquiry = {
        id: `inq_${Math.random().toString(36).slice(2, 11)}`,
        client_name: clientName,
        client_email: clientEmail,
        project_idea: body.project_idea || body.projectIdea || "",
        tech_stack_recommendation: body.tech_stack_recommendation || body.techStackRecommendation || "",
        estimated_hours: Number(body.estimated_hours ?? body.estimatedHours) || 0,
        estimated_cost: Number(body.estimated_cost ?? body.estimatedCost) || 0,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("inquiries").insert([inquiry]);
      if (error) return sendJson(res, 500, { error: error.message });
      return sendJson(res, 201, inquiry);
    }

    if (path === "upload-image" && req.method === "POST") {
      if (!supabase) return sendJson(res, 503, { error: "Supabase Storage is required for image uploads on Vercel." });

      const body = await readBody(req);
      const { projectId, filename, contentBase64, contentType } = body;
      if (!projectId || !filename || !contentBase64) {
        return sendJson(res, 400, { error: "projectId, filename and contentBase64 are required." });
      }

      const safeProjectId = String(projectId).replace(/[^a-z0-9_-]/gi, "_");
      const safeFilename = String(filename).replace(/[^a-z0-9._-]/gi, "_");
      const storagePath = `${safeProjectId}/${Date.now()}_${safeFilename}`;
      const buffer = Buffer.from(contentBase64, "base64");
      const { error } = await supabase.storage.from("projects").upload(storagePath, buffer, {
        contentType: contentType || "image/jpeg",
        upsert: true,
      });

      if (error) return sendJson(res, 500, { error: error.message });

      const publicUrl = supabase.storage.from("projects").getPublicUrl(storagePath).data.publicUrl;
      return sendJson(res, 200, { publicUrl, path: storagePath, storage: "supabase" });
    }

    return sendJson(res, 404, { error: `API route not found: /api/${path}` });
  } catch (error: any) {
    return sendJson(res, 500, { error: error?.message || "Unexpected API error." });
  }
}

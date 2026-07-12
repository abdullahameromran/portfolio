import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, Shield, AlertCircle, CheckCircle, RefreshCw, 
  Terminal, Code2, Plus, Edit, Trash2, Mail, ExternalLink, 
  Layers, Copy, ChevronDown, ChevronUp, FileText, User, DollarSign, Clock, HelpCircle, Eye
} from "lucide-react";
import { Project } from "../types";
import TagInput from "./TagInput";
import ImageUploader from "./ImageUploader";
import defaultProjects from "../data/defaultProjects";

export default function AdminSection() {
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    url: string;
    message: string;
    tablesExist?: { projects: boolean; inquiries: boolean };
    error?: string;
  } | null>(null);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"status" | "projects" | "inquiries" | "schema">("status");
  
  // Projects states
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectFormError, setProjectFormError] = useState("");
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Inquiries states
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  // Schema state
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Load Status & Data
  const checkStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/supabase-status");
      const data = await res.json();
      setSupabaseStatus(data);
    } catch (err) {
      console.error("Failed to fetch Supabase status:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) && data.length > 0 ? data : defaultProjects);
    } catch (err) {
      console.error("Failed to load projects:", err);
      // Fallback to local default projects so admin UI is usable without a live backend
      setProjects(defaultProjects);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    checkStatus();
    loadProjects();
    loadInquiries();
  }, []);

  const handleCopySchema = () => {
    const schemaSql = `-- 1. Create Projects Table
create table projects (
  id text primary key,
  title text not null,
  description text,
  long_description text,
  category text not null,
  tech_stack jsonb default '[]'::jsonb,
  metrics jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  db_structure jsonb default '[]'::jsonb,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS and create open security policies (or service-role edits)
alter table projects enable row level security;
create policy "Allow public read-only access on projects" on projects for select using (true);
create policy "Allow public modifications for developers" on projects for all using (true);

-- 2. Create Inquiries Table
create table inquiries (
  id text primary key,
  client_name text not null,
  client_email text not null,
  project_idea text,
  tech_stack_recommendation text,
  estimated_hours numeric default 0,
  estimated_cost numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table inquiries enable row level security;
create policy "Allow public inserts on inquiries" on inquiries for insert with check (true);
create policy "Allow public reads for admin panel" on inquiries for select using (true);
create policy "Allow public updates/deletes for admin panel" on inquiries for all using (true);

-- 3. Create Guestbook Table
create table guestbook (
  id text primary key,
  name text not null,
  role text not null,
  mood text not null,
  message text not null,
  coffee_sent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table guestbook enable row level security;
create policy "Allow public inserts on guestbook" on guestbook for insert with check (true);
create policy "Allow public reads for everyone" on guestbook for select using (true);
create policy "Allow public updates/deletes for admin panel" on guestbook for all using (true);`;

    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.category) {
      setProjectFormError("Title and Category are required.");
      return;
    }

    setIsSavingProject(true);
    setProjectFormError("");

    try {
      const isEdit = !!editingProject.id;
      const url = isEdit ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const payload: any = { ...editingProject };
      // ensure arrays
      payload.techStack = Array.isArray(editingProject.techStack) ? editingProject.techStack : [];
      payload.metrics = Array.isArray(editingProject.metrics) ? editingProject.metrics : [];
      payload.features = Array.isArray(editingProject.features) ? editingProject.features : [];
      payload.images = Array.isArray(editingProject.images) ? editingProject.images : (editingProject.imageUrl ? [editingProject.imageUrl] : []);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedProject = await res.json();
        if (isEdit) {
          // reload all
          await loadProjects();
        } else {
          setProjects([savedProject, ...projects]);
        }
        setEditingProject(null);
      } else {
        const errData = await res.json();
        setProjectFormError(errData.error || "Failed to save project.");
      }
    } catch (err) {
      console.error("Error saving project:", err);
      setProjectFormError("Network error saving project.");
    } finally {
      setIsSavingProject(false);
    }
  };

  const startNewProject = () => {
    setEditingProject({
      title: "",
      description: "",
      longDescription: "",
      category: "SaaS",
      techStack: [],
      metrics: [],
      features: [],
      dbStructure: [],
      imageUrl: ""
    });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
            <Shield className="h-3.5 w-3.5" />
            <span>Developer Space</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">Supabase Admin Control</h2>
          <p className="text-slate-400 max-w-lg">
            Manage your portfolios commercial case studies, real-time client inquiries, and view PostgreSQL schemas.
          </p>
        </div>

        {/* Quick status badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              checkStatus();
              loadProjects();
              loadInquiries();
            }}
            disabled={loadingStatus}
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingStatus ? "animate-spin text-blue-400" : ""}`} />
            Refresh Core
          </button>
        </div>
      </div>

      {/* Connection warning or success alert */}
      {supabaseStatus && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl p-5 border ${
            supabaseStatus.configured 
              ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
              : "bg-amber-950/20 border-amber-500/20 text-amber-300"
          }`}
        >
          <div className="flex items-start gap-3.5">
            {supabaseStatus.configured ? (
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">
                {supabaseStatus.configured ? "Supabase Connected" : "Local Mock Database Mode"}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {supabaseStatus.message}
              </p>
              {supabaseStatus.configured && supabaseStatus.tablesExist && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${supabaseStatus.tablesExist.projects ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    projects table: {supabaseStatus.tablesExist.projects ? "Online" : "Missing Schema"}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${supabaseStatus.tablesExist.inquiries ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    inquiries table: {supabaseStatus.tablesExist.inquiries ? "Online" : "Missing Schema"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {supabaseStatus.configured ? (
              <span className="text-[10px] font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                URL: {supabaseStatus.url.replace("https://", "").split(".")[0]}...
              </span>
            ) : (
              <button
                onClick={() => setActiveSubTab("schema")}
                className="rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3.5 py-1.5 text-xs font-semibold text-amber-200 transition-all"
              >
                Setup Supabase Schema
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => { setActiveSubTab("status"); setEditingProject(null); }}
          className={`px-5 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all ${
            activeSubTab === "status"
              ? "border-blue-500 text-white font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          System Health
        </button>
        <button
          onClick={() => { setActiveSubTab("projects"); }}
          className={`px-5 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all ${
            activeSubTab === "projects"
              ? "border-blue-500 text-white font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Manage Projects ({projects.length})
        </button>
        <button
          onClick={() => { setActiveSubTab("inquiries"); }}
          className={`px-5 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all ${
            activeSubTab === "inquiries"
              ? "border-blue-500 text-white font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Client Leads ({inquiries.length})
        </button>
        <button
          onClick={() => { setActiveSubTab("schema"); setEditingProject(null); }}
          className={`px-5 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all ${
            activeSubTab === "schema"
              ? "border-blue-500 text-white font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Supabase SQL Setup
        </button>
      </div>

      {/* SUB-TABS CONTENT */}
      <div>
        {/* TAB 1: SYSTEM HEALTH */}
        {activeSubTab === "status" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Terminal className="h-5 w-5 text-blue-400" />
                <h3>Environment Configuration</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                To connect Abdullah's portfolio to your live Supabase instance, define the environment secrets inside the **Settings & Secrets** panel of AI Studio:
              </p>
              <div className="space-y-2 font-mono text-[11px] bg-slate-950 p-4 rounded-xl border border-slate-800/60">
                <div className="text-slate-500"># URL of your Supabase Workspace</div>
                <div><span className="text-purple-400">SUPABASE_URL</span>=<span className="text-emerald-400">"https://your-proj.supabase.co"</span></div>
                <div className="text-slate-500 pt-1"># Public Anon or Service Role key</div>
                <div><span className="text-purple-400">SUPABASE_ANON_KEY</span>=<span className="text-emerald-400">"eyJhbGciOi..."</span></div>
              </div>
              <div className="text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50 leading-relaxed">
                💡 **Fully Decoupled Design**: The application backend uses an interactive in-memory list if those keys aren't set. This ensures you can play with the dashboard, insert custom projects, and view client inquiry leads instantly before attaching keys!
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Layers className="h-5 w-5 text-emerald-400" />
                <h3>Portfolio Live Metrics</h3>
              </div>
              <p className="text-xs text-slate-400">
                Aggregate stats tracking live database rows and content metrics.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Case Studies</span>
                  <p className="font-display text-2xl font-extrabold text-white">{projects.length}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active Client Leads</span>
                  <p className="font-display text-2xl font-extrabold text-white">{inquiries.length}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="font-mono text-[11px] text-white">
                    {supabaseStatus?.configured ? "Supabase (PostgreSQL)" : "In-Memory Fallback DB"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Vite SSR Proxy Layer:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Active (/api/*)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PROJECTS */}
        {activeSubTab === "projects" && (
          <div className="space-y-6">
            {!editingProject ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Projects List</h3>
                  <button
                    onClick={startNewProject}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-all active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    Create Case Study
                  </button>
                </div>

                {loadingProjects ? (
                  <div className="py-20 text-center text-slate-500 text-xs">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-blue-500" />
                    Loading portfolio projects...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 text-slate-500 text-xs">
                    No projects found. Click "Create Case Study" to add one!
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-5 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {(proj.images && proj.images.length > 0) || proj.imageUrl ? (
                            <img
                              src={proj.images && proj.images.length > 0 ? proj.images[0] : proj.imageUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="h-12 w-20 object-cover rounded bg-slate-900 border border-slate-800/80 flex-shrink-0"
                            />
                          ) : null}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                              <span className="text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                                {proj.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 max-w-xl line-clamp-1">{proj.description}</p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {proj.techStack?.slice(0, 4).map((tech, i) => (
                                <span key={i} className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                                  {tech}
                                </span>
                              ))}
                              {proj.techStack && proj.techStack.length > 4 && (
                                <span className="text-[9px] font-mono text-slate-500 px-1 py-0.5">+{proj.techStack.length - 4} more</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all active:scale-95"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 transition-all active:scale-95"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* PROJECT EDITING FORM */
              <motion.form
                onSubmit={handleSaveProject}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-6 max-w-4xl mx-auto"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-white text-base">
                    {editingProject.id ? `Edit: ${editingProject.title}` : "Create New Case Study"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="text-slate-500 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                {projectFormError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{projectFormError}</span>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ""}
                      onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. My Saas Dashboard Platform"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Category *</label>
                    <select
                      value={editingProject.category || "SaaS"}
                      onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="SaaS">SaaS</option>
                      <option value="Client Portal">Client Portal</option>
                      <option value="MVP">MVP</option>
                      <option value="AI Automation">AI Automation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-400">Short Summary *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.description || ""}
                      onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                      placeholder="e.g. An AI-powered assessment builder which instantly drafts examinations."
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-400">Long Case Study Description</label>
                    <textarea
                      rows={4}
                      value={editingProject.longDescription || ""}
                      onChange={e => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                      placeholder="Describe the product goals, Abdullah's engineering role, complex scheduling mechanisms, and client impacts..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-400">Website URL (optional)</label>
                    <input
                      type="text"
                      value={editingProject.websiteUrl || ""}
                      onChange={e => setEditingProject({ ...editingProject, websiteUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <label className="text-xs font-semibold text-slate-400 pt-2">Project Images</label>
                    <ImageUploader
                      projectId={editingProject.id || "proj_temp"}
                      images={Array.isArray(editingProject.images) ? editingProject.images : (editingProject.imageUrl ? [editingProject.imageUrl] : [])}
                      onChange={(imgs) => setEditingProject({ ...editingProject, images: imgs })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Tech Stack Tags</label>
                    <TagInput
                      value={Array.isArray(editingProject.techStack) ? editingProject.techStack : []}
                      onChange={(items) => setEditingProject({ ...editingProject, techStack: items })}
                      placeholder="e.g. Next.js"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Metrics Bullet Points</label>
                    <TagInput
                      value={Array.isArray(editingProject.metrics) ? editingProject.metrics : []}
                      onChange={(items) => setEditingProject({ ...editingProject, metrics: items })}
                      placeholder="e.g. Processed $45K+"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Key Features List</label>
                    <TagInput
                      value={Array.isArray(editingProject.features) ? editingProject.features : []}
                      onChange={(items) => setEditingProject({ ...editingProject, features: items })}
                      placeholder="e.g. Multi-tier billing"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="rounded-xl border border-slate-800 hover:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-all"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProject}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50"
                  >
                    {isSavingProject && <RefreshCw className="h-3 w-3 animate-spin" />}
                    Save Case Study
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        )}

        {/* TAB 3: MANAGE CLIENT INQUIRIES */}
        {activeSubTab === "inquiries" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Inquiries List (Left Column) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Client Inquiry Leads</h3>
              
              {loadingInquiries ? (
                <div className="py-20 text-center text-slate-500 text-xs">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-blue-500" />
                  Loading client inquiries...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 text-slate-500 text-xs">
                  No inquiries received yet. Submit one from the Scope Estimator to test!
                </div>
              ) : (
                <div className="grid gap-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedInquiry?.id === inq.id
                          ? "bg-blue-950/25 border-blue-500/50"
                          : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-white">{inq.client_name}</h4>
                          <span className="text-[10px] font-mono text-slate-500">{inq.client_email}</span>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="inline-flex text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400">
                            ${Number(inq.estimated_cost).toLocaleString()}
                          </span>
                          <p className="text-[9px] text-slate-500 font-mono">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-2">{inq.project_idea}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inquiry Details Viewer (Right Column) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 space-y-6 sticky top-24">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-white text-base">Inquiry Breakdown</h3>
                  <p className="text-xs text-slate-400">Select a lead from the list on the left to review metrics.</p>
                </div>

                {selectedInquiry ? (
                  <motion.div
                    key={selectedInquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start">
                        <User className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-white">{selectedInquiry.client_name}</h4>
                          <a href={`mailto:${selectedInquiry.client_email}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                            {selectedInquiry.client_email}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Estimated Scope</span>
                          <span className="font-display font-bold text-base text-white flex items-center justify-center gap-1 mt-1">
                            <Clock className="h-4 w-4 text-indigo-400" />
                            {selectedInquiry.estimated_hours} hrs
                          </span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Budget Quote</span>
                          <span className="font-display font-bold text-base text-white flex items-center justify-center gap-0.5 mt-1">
                            <DollarSign className="h-4 w-4 text-emerald-400" />
                            {Number(selectedInquiry.estimated_cost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-900 pt-4">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Project Scope Idea</span>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-900 font-sans">
                        {selectedInquiry.project_idea}
                      </p>
                    </div>

                    {selectedInquiry.tech_stack_recommendation && (
                      <div className="space-y-2 border-t border-slate-900 pt-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Recommended Stack</span>
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs text-blue-300 font-semibold">
                          <Layers className="h-3.5 w-3.5" />
                          {selectedInquiry.tech_stack_recommendation}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="py-20 text-center text-slate-600 text-xs flex flex-col items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-slate-800" />
                    <span>No active lead selected. Click any lead card on the left to see full blueprint details.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPABASE SQL SETUP */}
        {activeSubTab === "schema" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="font-bold text-white text-base">PostgreSQL Table Creation Query</h3>
                    <p className="text-xs text-slate-400">Copy this schema and run it in your Supabase SQL Editor to provision the tables instantly.</p>
                  </div>
                </div>

                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 transition-all active:scale-95"
                >
                  <Copy className={`h-4 w-4 ${copiedSchema ? "text-emerald-400" : ""}`} />
                  {copiedSchema ? "Copied SQL!" : "Copy SQL Script"}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-900 bg-[#04060d]">
                <pre className="p-5 overflow-x-auto text-[11px] font-mono text-blue-300/90 leading-relaxed max-h-[420px] select-all">
{`-- 1. Create Projects Table
create table projects (
  id text primary key,
  title text not null,
  description text,
  long_description text,
  category text not null,
  tech_stack jsonb default '[]'::jsonb,
  metrics jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  db_structure jsonb default '[]'::jsonb,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS and create open security policies
alter table projects enable row level security;
create policy "Allow public read-only access on projects" on projects for select using (true);
create policy "Allow public modifications for developers" on projects for all using (true);

-- 2. Create Inquiries Table
create table inquiries (
  id text primary key,
  client_name text not null,
  client_email text not null,
  project_idea text,
  tech_stack_recommendation text,
  estimated_hours numeric default 0,
  estimated_cost numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table inquiries enable row level security;
create policy "Allow public inserts on inquiries" on inquiries for insert with check (true);
create policy "Allow public reads for admin panel" on inquiries for select using (true);
create policy "Allow public updates/deletes for admin panel" on inquiries for all using (true);`}
                </pre>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/20 p-6 space-y-3 text-xs leading-relaxed text-slate-400">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-blue-400" />
                Frequently Asked Questions
              </h4>
              <div className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-slate-200">Q: Do I need to enable RLS (Row Level Security)?</p>
                  <p className="mt-0.5">A: Yes. For production, enabling RLS is best practice. The queries above include open test policies for simple bootstrapping. In a secure environment, restrict writes strictly to service-role API queries or authenticated developers.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Q: Can I add a project immediately?</p>
                  <p className="mt-0.5">A: Yes! Because this applet incorporates a high-fidelity REST api on Express, any project added in "Manage Projects" is preserved in memory even if Supabase is disconnected, allowing you to test out the visual catalog immediately.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
